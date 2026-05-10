import nodemailer from "nodemailer";
import config from "../Config/Config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "oauth2",
    user: config.GOOGEL_USER,
    clientId: config.GOOGEL_CLIENT_ID,
    clientSecret: config.GOOGEL_CLIENT_SECRET,
    refreshToken: config.GOOGEL_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error in Email Services", error);
  } else {
    console.log("Email Services is ready to send");
  }
});

export const Sendemail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.GOOGEL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully", info.messageId);
  } catch (error) {
    console.log("error in sending email", error);
  }
};
