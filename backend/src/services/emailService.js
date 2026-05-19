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
