import nodemailer from "nodemailer";
import config from "../Config/Config.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL/TLS use karna industry standard hai
  auth: {
    user:config.GOOGEL_USER,
    pass: config.APP_PASSWORD, 
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
    throw new Error("Could not send email. Please try again later.");
  }
};
