import { Resend } from 'resend';

export async function sendEmail({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) {

    const resend = new Resend(process.env.RESEND_API_KEY)
       

    try {
        const { data } = await resend.emails.send({
            to: "np03cs4a220286@heraldcollege.edu.np",
            from: process.env.EMAIL_FROM as string,
            subject: "sdfhksd",
            html: ` <h1>Hiii</h1>`,
        });
        console.log("sent");

    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message: "Failed to send email. Please try again later.",
        }
    }
}