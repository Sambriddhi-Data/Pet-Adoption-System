import { sendEmail } from "@/utils/mail.utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const verifySchema = z.object({
  userName: z.string(),
  userEmail: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = verifySchema.parse(body);

        const sender = {
            name: "Fur Ever Friends",
            address: "noreply@fureverfriends.com",
        };
        const recipients = [
            {
                name: data.userName,
                address: data.userEmail,
            },
        ];

        const route = `${process.env.BETTER_AUTH_URL}/sign-in`;
        const result = await sendEmail({
            sender,
            recipients,
            subject: "Shelter Verified",
            message: `
                <h1>Welcome to Fur-Ever Friends</h1>

                <p>Hi ${data.userName},</p>
                <p>Congratulations! Your shelter has been successfully verified.</p>
                <p>We are thrilled to have you on board and look forward to working together to find loving homes for all the wonderful animals in your care.</p>
                <br/><br/>
                <p>As a verified shelter, you now have access to our platform where you can showcase your animals for adoption and connect with potential adopters.</p>
                <p>To get started, please log in to your account using the link below:</p>
                <p><a href="${route}">Sign In Now</a></p>

                <br/> <br/>
                <p>Best regards,</p>
                <p>The Fur-Ever Friends Team</p>
                <p<strong>>Note: This is an automated message, please do not reply.</strong></p>
            `,
        });

        return NextResponse.json({ accepted: result.accepted });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Unable to send email" }, { status: 500 });
    }
}
