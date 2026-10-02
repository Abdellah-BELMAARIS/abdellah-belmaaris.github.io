import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
let sendGmail: any;
try {
  sendGmail = require('./scripts/sendGmail.cjs').sendGmail;
} catch {
  sendGmail = null;
}

function gmailSmtpPlugin(): Plugin {
  return {
    name: 'gmail-smtp-server-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            if (sendGmail) {
              const result = await sendGmail({
                to: 'obaidbelmaaris@gmail.com',
                fromName: data.name ? `${data.name} (Portfolio Inquiry)` : 'Portfolio Client',
                replyTo: data.email,
                subject: data._subject || data.subject || `New Portfolio Message from ${data.name || 'Visitor'}`,
                text: data.summary || data.message || JSON.stringify(data, null, 2),
                data: data
              });
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true, success: true, method: 'gmail-smtp', result }));
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: 'SMTP sender not initialized' }));
            }
          } catch (err: any) {
            console.error('Vite Gmail SMTP Error:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), gmailSmtpPlugin()],
  server: {
    port: 8000,
  },
})

