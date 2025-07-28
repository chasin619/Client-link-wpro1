import nodemailer from "nodemailer";

export const sendEmailEvent = async (
  to: string,
  subject: string,
  html: string,
  from: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};
