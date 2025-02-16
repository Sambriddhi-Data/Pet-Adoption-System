import { sendEmail } from "@/utils/mail.utils"

export async function POST() {
    const sender = {
        name: 'Fur Ever Friends',
        address: 'samstha98461@gmail.com',
    };
    const recipients = [{
        name: 'Sambriddhi Shrestha',
        address: 'samstha98461@gmail.com' // Use a Mailtrap test email
    }];

    try {
        const result = await sendEmail({
            sender,
            recipients,
            subject: 'Welcome to Fur-Ever Friends',
            message: 'Verify your email'
        });

        return new Response(JSON.stringify({ accepted: result.accepted }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ message: 'Unable to send email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


