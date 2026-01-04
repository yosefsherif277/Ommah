import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    auth :{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to: string, subject: string, body: string) => {
    const response = {
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    };
    return response;;
}
export default sendEmail;