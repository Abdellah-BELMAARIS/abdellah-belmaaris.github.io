// High-End Portfolio Design Email Template
// Matches the visual aesthetics of Abdellah BELMAARIS's portfolio:
// Dark theme canvas (#0B0F19), slate card (#111827), emerald accents (#10B981), cyan (#06B6D4) and modern typography.

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildPortfolioEmailHtml(data = {}) {
  const name = escapeHtml(data.name || 'Anonymous Client');
  const email = escapeHtml(data.email || 'not-provided@example.com');
  const company = escapeHtml(data.company || '');
  const clientType = escapeHtml(data.client_type || data.clientType || '');
  const timeline = escapeHtml(data.timeline || '');
  const budget = escapeHtml(data.budget || '');
  const rawDescription = data.description || data.message || '';
  const description = escapeHtml(rawDescription);
  const subject = escapeHtml(data._subject || data.subject || 'New Portfolio Inquiry');

  // Handle services
  let services = [];
  if (Array.isArray(data.services)) {
    services = data.services;
  } else if (typeof data.services === 'string' && data.services.trim()) {
    services = data.services.split(',').map(s => s.trim()).filter(Boolean);
  }

  const isProjectRequest = services.length > 0 || !!clientType || !!budget || !!timeline;
  const badgeLabel = isProjectRequest ? '● NEW PROJECT PROPOSAL' : '● DIRECT CONTACT MESSAGE';
  const sectionTitle = isProjectRequest ? 'PROJECT SPECIFICATIONS' : 'MESSAGE CONTENT';

  const servicesHtml = services.length > 0
    ? services.map(s => `
        <span style="display:inline-block; margin: 4px 6px 4px 0; padding: 6px 14px; background: rgba(16, 185, 129, 0.12); border: 1px solid #059669; border-radius: 9999px; color: #34d399; font-size: 13px; font-weight: 600; text-decoration: none;">
          ✓ ${escapeHtml(s)}
        </span>
      `).join('')
    : '';

  const budgetTimelineHtml = (budget || timeline)
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-collapse: separate; border-spacing: 10px 0;">
        <tr>
          ${budget ? `
            <td width="50%" style="background-color: #1a2333; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 10px; padding: 12px 16px; vertical-align: top;">
              <div style="color: #fbbf24; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Estimated Budget</div>
              <div style="color: #fef3c7; font-size: 15px; font-weight: 700; margin-top: 4px;">💰 ${budget}</div>
            </td>
          ` : ''}
          ${timeline ? `
            <td width="${budget ? '50%' : '100%'}" style="background-color: #1a2333; border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 10px; padding: 12px 16px; vertical-align: top;">
              <div style="color: #818cf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Preferred Timeline</div>
              <div style="color: #e0e7ff; font-size: 15px; font-weight: 700; margin-top: 4px;">⏱️ ${timeline}</div>
            </td>
          ` : ''}
        </tr>
      </table>
    `
    : '';

  const replyMailto = `mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased; line-height: 1.5;">

  <!-- Outer Email Container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
    
    <!-- Top Glowing Gradient Bar -->
    <tr>
      <td style="height: 4px; background: linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #6366f1 100%);"></td>
    </tr>

    <!-- Brand Header -->
    <tr>
      <td style="padding: 28px 28px 20px 28px; background-color: #111827; border-bottom: 1px solid #1e293b;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align: middle;">
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 9999px; color: #10b981; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                ${badgeLabel}
              </span>
              <h1 style="margin: 12px 0 4px 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">
                ABDELLAH BELMAARIS
              </h1>
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                Junior Full-Stack Developer &amp; AI Systems Specialist • Casablanca, Morocco
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Area -->
    <tr>
      <td style="padding: 28px;">

        <!-- Client Information Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #162032; border: 1px solid #243049; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <tr>
            <td style="padding: 18px 20px; border-bottom: 1px solid #243049;">
              <div style="color: #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
                CLIENT PROFILE
              </div>
              <div style="color: #ffffff; font-size: 18px; font-weight: 700;">
                ${name}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; width: 130px; vertical-align: top;">
                    Email Address:
                  </td>
                  <td style="padding: 6px 0; color: #f1f5f9; font-size: 14px; font-weight: 600; vertical-align: top;">
                    <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${company ? `
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; width: 130px; vertical-align: top;">
                    Company / Org:
                  </td>
                  <td style="padding: 6px 0; color: #e2e8f0; font-size: 14px; vertical-align: top;">
                    ${company}
                  </td>
                </tr>
                ` : ''}
                ${clientType ? `
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; width: 130px; vertical-align: top;">
                    Entity / Profile:
                  </td>
                  <td style="padding: 6px 0; vertical-align: top;">
                    <span style="display: inline-block; padding: 2px 10px; background-color: #1e293b; border: 1px solid #3b82f6; border-radius: 6px; color: #60a5fa; font-size: 12px; font-weight: 600;">
                      ${clientType}
                    </span>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; width: 130px; vertical-align: top;">
                    Submission Time:
                  </td>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 12px; vertical-align: top;">
                    ${new Date().toUTCString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${servicesHtml ? `
        <!-- Services Section -->
        <div style="margin-bottom: 24px;">
          <div style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;">
            REQUESTED TECHNICAL SERVICES
          </div>
          <div>
            ${servicesHtml}
          </div>
          ${budgetTimelineHtml}
        </div>
        ` : ''}

        <!-- Description / Message Box -->
        <div style="margin-bottom: 28px;">
          <div style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;">
            ${sectionTitle}
          </div>
          <div style="background-color: #0d131f; border-left: 4px solid #10b981; border-top: 1px solid #1e293b; border-right: 1px solid #1e293b; border-bottom: 1px solid #1e293b; border-radius: 0 10px 10px 0; padding: 18px 20px; color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap; word-break: break-word;">${description || '(No additional text provided)'}</div>
        </div>

        <!-- Action Call to Action Buttons -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px;">
          <tr>
            <td>
              <a href="${replyMailto}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #0b0f19; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); text-align: center;">
                ⚡ Direct Reply to ${name}
              </a>
              <a href="https://abdellah-belmaaris.github.io/" style="display: inline-block; padding: 12px 20px; background-color: #1e293b; color: #cbd5e1; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 8px; border: 1px solid #334155; margin-left: 8px; text-align: center;">
                View Portfolio ↗
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer Area -->
    <tr>
      <td style="padding: 22px 28px; background-color: #0d131f; border-top: 1px solid #1e293b; text-align: center;">
        <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 12px; font-weight: 600;">
          Abdellah BELMAARIS • Official Portfolio Dispatch
        </p>
        <p style="margin: 0; color: #64748b; font-size: 11px;">
          Origin: <a href="https://abdellah-belmaaris.github.io/" style="color: #10b981; text-decoration: none;">abdellah-belmaaris.github.io</a> • Casablanca, Morocco
        </p>
        <p style="margin: 8px 0 0 0; color: #475569; font-size: 11px;">
          <a href="https://github.com/Abdellah-BELMAARIS" style="color: #94a3b8; text-decoration: none; margin: 0 6px;">GitHub</a> |
          <a href="https://linkedin.com/in/abdellah-belmaaris" style="color: #94a3b8; text-decoration: none; margin: 0 6px;">LinkedIn</a> |
          <a href="mailto:obaidbelmaaris@gmail.com" style="color: #94a3b8; text-decoration: none; margin: 0 6px;">Email</a>
        </p>
      </td>
    </tr>

  </table>

</body>
</html>`.trim();
}

module.exports = {
  buildPortfolioEmailHtml
};
