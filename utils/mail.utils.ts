import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
} as SMTPTransport.Options);

type TSendEmail = {
    sender: Mail.Address,
    recipients: Mail.Address[],
    subject: string;
    message:string;
}

export const sendEmail = async(ffe: TSendEmail) =>{
    const {sender, recipients, subject, message} = ffe;

    return await transport .sendMail({
        from: sender,
        to: recipients,
        subject,
        html: message,
        text: message
    })
}