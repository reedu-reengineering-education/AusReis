// // path: /src/helpers/email-helper.ts
// import nodemailer from "nodemailer";
// import { render } from "@react-email/render";
// import React from "react";

// type EmailPayload = {
//   //   from: string;
//   to: string;
//   subject: string;
//   html: string;
//   component: React.ComponentType<any>;
//   props: Record<string, any>;
// };
// const smtpSettings = {
//   host: process.env.SMTP_HOST,
//   //@ts-ignore
//   port: parseInt(process.env.SMTP_PORT || "1025"),
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
//   secureConnection: false, // TLS requires secureConnection to be false
//   tls: {
//     ciphers: "SSLv3",
//   },
// };

// export const handleEmailFire = async (data: EmailPayload) => {
//   console.log("data", data, smtpSettings);
//   const fromAddress = process.env.SMTP_FROM;
//   const transporter = nodemailer.createTransport(smtpSettings);
//   const emailHtml = await render(
//     React.createElement(data.component, data.props)
//   );

//   return await transporter.sendMail({
//     from: fromAddress,
//     to: data.to,
//     subject: data.subject,
//     html: emailHtml,
//     // ...data,
//   });
// };
// path: /src/helpers/email-helper.ts
// path: /src/helpers/email-helper.ts
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import React from "react";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
};

const smtpSettings: SMTPTransport.Options = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "1025"),
  auth:
    process.env.NODE_ENV === "production"
      ? {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASSWORD || "",
        }
      : undefined,
  secure: false, // Use `secure: true` for SSL
  tls: {
    ciphers: "SSLv3",
  },
};

export const handleEmailFire = async (data: EmailPayload): Promise<void> => {
  const fromAddress = process.env.EMAIL_FROM;
  if (!fromAddress) {
    throw new Error("EMAIL_FROM is not set in environment variables");
  }

  try {
    const transporter = nodemailer.createTransport(smtpSettings);
    const emailHtml = await render(
      React.createElement(data.component, data.props)
    );

    const result = await transporter.sendMail({
      from: fromAddress,
      to: data.to,
      subject: data.subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
