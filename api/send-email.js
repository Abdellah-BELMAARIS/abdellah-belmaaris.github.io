// Serverless Handler for Gmail SMTP Email Delivery
// Compatible with Vercel, Netlify Functions, and Node.js server environments

const tls = require('tls');
const fs = require('fs');
const path = require('path');

function getEnvValue(key, fallback = '') {
  if (process.env[key]) return process.env[key];
  try {
    const candidates = [
      path.resolve(__dirname, '.env'),
      path.resolve(__dirname, '../.env'),
      path.resolve(process.cwd(), '.env')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const text = fs.readFileSync(p, 'utf8');
        for (const line of text.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.startsWith(key + '=')) {
            return trimmed.slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  } catch {}
  return fallback;
}

function sendGmail({ to, fromName, subject, text, replyTo, user, pass }) {
  return new Promise((resolve, reject) => {
    const gmailUser = user || getEnvValue('GMAIL_USER', 'obaidbelmaaris@gmail.com');
    const rawPass = pass || getEnvValue('GMAIL_APP_PASS', '');
    const gmailPass = rawPass.replace(/\s+/g, '');

    if (!gmailPass) {
      return reject(new Error('Missing GMAIL_APP_PASS environment variable.'));
    }

    const socket = tls.connect(465, 'smtp.gmail.com', () => {});
    socket.setEncoding('utf8');
    let state = 'INIT';

    socket.on('data', (raw) => {
      const data = raw.toString();

      if (state === 'INIT' && data.startsWith('220')) {
        state = 'EHLO';
        socket.write('EHLO localhost\r\n');
      } else if (state === 'EHLO' && (data.includes('250-AUTH') || data.includes('250 AUTH'))) {
        state = 'AUTH';
        const auth = Buffer.from(`\0${gmailUser}\0${gmailPass}`).toString('base64');
        socket.write(`AUTH PLAIN ${auth}\r\n`);
      } else if (state === 'AUTH') {
        if (data.startsWith('235')) {
          state = 'MAIL';
          socket.write(`MAIL FROM:<${gmailUser}>\r\n`);
        } else {
          socket.end();
          return reject(new Error('Gmail Authentication failed: ' + data.trim()));
        }
      } else if (state === 'MAIL' && data.startsWith('250')) {
        state = 'RCPT';
        socket.write(`RCPT TO:<${to || gmailUser}>\r\n`);
      } else if (state === 'RCPT' && data.startsWith('250')) {
        state = 'DATA';
        socket.write('DATA\r\n');
      } else if (state === 'DATA' && data.startsWith('354')) {
        state = 'SENDING';
        const subjectEncoded = `=?UTF-8?B?${Buffer.from(subject || 'Portfolio Inquiry').toString('base64')}?=`;
        const headers = [
          `From: "${fromName || 'Portfolio Bot'}" <${gmailUser}>`,
          `To: <${to || gmailUser}>`,
          replyTo ? `Reply-To: <${replyTo}>` : '',
          `Subject: ${subjectEncoded}`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=UTF-8',
          ''
        ].filter(Boolean).join('\r\n');

        socket.write(`${headers}\r\n${text || ''}\r\n.\r\n`);
      } else if (state === 'SENDING' && data.startsWith('250')) {
        state = 'DONE';
        socket.write('QUIT\r\n');
        resolve({ success: true, message: 'Email delivered via Gmail SMTP' });
      }
    });

    socket.on('error', (err) => reject(err));

    setTimeout(() => {
      if (state !== 'DONE') {
        socket.destroy();
        reject(new Error('Gmail SMTP connection timed out'));
      }
    }, 15000);
  });
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const result = await sendGmail({
      to: 'obaidbelmaaris@gmail.com',
      fromName: data.name ? `${data.name} (Portfolio Client)` : 'Portfolio Client',
      replyTo: data.email,
      subject: data._subject || data.subject || `New Portfolio Inquiry from ${data.name || 'Visitor'}`,
      text: data.summary || data.message || JSON.stringify(data, null, 2)
    });

    res.status(200).json({ ok: true, success: true, method: 'gmail-smtp', result });
  } catch (error) {
    console.error('SMTP Delivery Error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
