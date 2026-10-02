const tls = require('tls');
const fs = require('fs');
const path = require('path');
let buildPortfolioEmailHtml;
try {
  buildPortfolioEmailHtml = require('./portfolioEmailTemplate.cjs').buildPortfolioEmailHtml;
} catch {
  buildPortfolioEmailHtml = null;
}

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

function sendGmail({ to, fromName, subject, text, html, data, replyTo, user, pass }) {
  return new Promise((resolve, reject) => {
    const gmailUser = user || getEnvValue('GMAIL_USER', 'obaidbelmaaris@gmail.com');
    const rawPass = pass || getEnvValue('GMAIL_APP_PASS', '');
    const gmailPass = rawPass.replace(/\s+/g, '');

    if (!gmailPass) {
      return reject(new Error('Missing GMAIL_APP_PASS. Please set it in .env or environment variables.'));
    }

    // Auto-generate portfolio design HTML if not explicitly supplied
    let emailHtml = html;
    if (!emailHtml && buildPortfolioEmailHtml) {
      emailHtml = buildPortfolioEmailHtml(data || {
        name: fromName,
        email: replyTo,
        message: text,
        subject
      });
    }

    const socket = tls.connect(465, 'smtp.gmail.com', () => {
      // Secure TLS socket connected
    });

    socket.setEncoding('utf8');
    let state = 'INIT';

    socket.on('data', (raw) => {
      const resp = raw.toString();

      if (state === 'INIT' && resp.startsWith('220')) {
        state = 'EHLO';
        socket.write('EHLO localhost\r\n');
      } else if (state === 'EHLO' && (resp.includes('250-AUTH') || resp.includes('250 AUTH'))) {
        state = 'AUTH';
        const auth = Buffer.from(`\0${gmailUser}\0${gmailPass}`).toString('base64');
        socket.write(`AUTH PLAIN ${auth}\r\n`);
      } else if (state === 'AUTH') {
        if (resp.startsWith('235')) {
          state = 'MAIL';
          socket.write(`MAIL FROM:<${gmailUser}>\r\n`);
        } else {
          socket.end();
          return reject(new Error('Gmail Authentication failed: ' + resp.trim()));
        }
      } else if (state === 'MAIL' && resp.startsWith('250')) {
        state = 'RCPT';
        socket.write(`RCPT TO:<${to || gmailUser}>\r\n`);
      } else if (state === 'RCPT' && resp.startsWith('250')) {
        state = 'DATA';
        socket.write('DATA\r\n');
      } else if (state === 'DATA' && resp.startsWith('354')) {
        state = 'SENDING';
        const subjectEncoded = `=?UTF-8?B?${Buffer.from(subject || 'Portfolio Inquiry').toString('base64')}?=`;
        const cleanFromName = (fromName || 'Abdellah Portfolio Dispatch').replace(/["\r\n]/g, '');

        let messageBody = '';
        const boundary = `----=_Part_Portfolio_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        const headers = [
          `From: "${cleanFromName}" <${gmailUser}>`,
          `To: <${to || gmailUser}>`,
          replyTo ? `Reply-To: <${replyTo}>` : '',
          `Subject: ${subjectEncoded}`,
          'MIME-Version: 1.0'
        ];

        if (emailHtml) {
          headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);

          const plainTextContent = text || 'New project request received from your portfolio. Please view in an HTML-compatible client.';

          messageBody = [
            headers.filter(Boolean).join('\r\n'),
            '', // Crucial blank line separating top headers from MIME parts
            `--${boundary}`,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            plainTextContent,
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            emailHtml,
            '',
            `--${boundary}--`,
            ''
          ].join('\r\n');
        } else {
          headers.push('Content-Type: text/plain; charset=UTF-8');
          headers.push('Content-Transfer-Encoding: 8bit');

          messageBody = [
            headers.filter(Boolean).join('\r\n'),
            '',
            text || ''
          ].join('\r\n');
        }

        socket.write(`${messageBody}\r\n.\r\n`);
      } else if (state === 'SENDING' && resp.startsWith('250')) {
        state = 'DONE';
        socket.write('QUIT\r\n');
        resolve({ success: true, message: 'Portfolio-designed email delivered via Gmail SMTP' });
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    setTimeout(() => {
      if (state !== 'DONE') {
        socket.destroy();
        reject(new Error('Gmail SMTP connection timed out'));
      }
    }, 15000);
  });
}

module.exports = { sendGmail };
