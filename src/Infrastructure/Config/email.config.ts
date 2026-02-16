export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: process.env.NODEMAILER_EMAIL!,
  pass: process.env.NODEMAILER_PASS!,
};
