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
            address: "samstha98461@gmail.com",
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
                <p>Your shelter has been successfully verified. You can now use Fur-Ever Friends, a platform to showcase shelter animals for adoption.</p>
                <p><a href="${route}">Sign Up Now</a></p>
            `,
        });

        return NextResponse.json({ accepted: result.accepted });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Unable to send email" }, { status: 500 });
    }
}
