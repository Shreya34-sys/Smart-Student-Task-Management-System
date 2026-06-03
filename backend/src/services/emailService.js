import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
}

export async function sendTaskEmail({ to, subject, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`Email skipped for ${to}: ${subject}`);
    return { skipped: true };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text
  });
}

export async function sendInviteEmail({ to, senderName, teamName, acceptUrl }) {
  const subject = `${senderName} invited you to Smart Student Tasks`;
  const text = `${senderName} invited you to join ${teamName} on Smart Student Tasks. Accept the invite: ${acceptUrl}`;
  const html = `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 12px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
                <tr>
                  <td style="background:linear-gradient(135deg,#14b8a6,#2563eb);padding:28px;color:#ffffff;">
                    <div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Smart Student Tasks</div>
                    <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">🤝 You have a teammate invite</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;"><strong>${senderName}</strong> invited you to collaborate on <strong>${teamName}</strong>.</p>
                    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;">Accept this invite to join the team, manage tasks, and collaborate with your classmates.</p>
                    <a href="${acceptUrl}" style="display:inline-block;border-radius:12px;background:linear-gradient(135deg,#14b8a6,#2563eb);color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;font-size:16px;">Accept Invite</a>
                    <p style="margin:24px 0 0 0;padding:16px;background:#f1f5f9;border-radius:8px;border-left:4px solid #14b8a6;">
                      <strong style="color:#0f172a;">📌 What happens next?</strong><br>
                      <span style="font-size:13px;color:#475569;">Click the button above to join the team. You'll be able to view shared tasks, collaborate on projects, and stay in sync with your teammates.</span>
                    </p>
                    <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#64748b;">This invite expires in 7 days. If the button does not work, copy and paste this link in your browser:<br><a href="${acceptUrl}" style="color:#2563eb;word-break:break-all;">${acceptUrl}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e5e7eb;font-size:12px;color:#64748b;">
                    <p style="margin:0;">© ${new Date().getFullYear()} Smart Student Tasks. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`Invite email skipped for ${to}: ${acceptUrl}`);
    return { skipped: true };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html
  });
}


export async function sendPasswordResetEmail({ to, resetUrl, expiresInMinutes = 15 }) {
  const subject = "Reset Your Password - Smart Student Tasks";
  const text = `Click the link below to reset your password. This link expires in ${expiresInMinutes} minutes.\n\n${resetUrl}`;

  const html = `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 12px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
                <tr>
                  <td style="background:linear-gradient(135deg,#14b8a6,#2563eb);padding:28px;color:#ffffff;">
                    <div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Smart Student Tasks</div>
                    <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">Reset Your Password</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
                    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;"><strong>⏱️ This link expires in ${expiresInMinutes} minutes</strong></p>
                    <a href="${resetUrl}" style="display:inline-block;border-radius:12px;background:linear-gradient(135deg,#14b8a6,#2563eb);color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;">Reset Password</a>
                    <p style="margin:24px 0 0 0;padding:16px;background:#f1f5f9;border-radius:8px;border-left:4px solid #14b8a6;">
                      <strong style="color:#0f172a;">🔒 Security Notice:</strong><br>
                      <span style="font-size:13px;color:#475569;">If you didn't request a password reset, please ignore this email. This link will expire automatically for your security.</span>
                    </p>
                    <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#64748b;">
                      If the button does not work, copy and paste this link in your browser:<br>
                      <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e5e7eb;font-size:12px;color:#64748b;">
                    <p style="margin:0;">© 2024 Smart Student Tasks. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  console.log(`\n\n=== TESTING RESET URL: ${resetUrl} ===\n\n`);
  if (!transporter) {
    console.log(`Password reset email skipped for ${to}: ${resetUrl}`);
    return { skipped: true };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text,
    html
  });
}
