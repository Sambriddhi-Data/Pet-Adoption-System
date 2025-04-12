import { sendEmail } from "@/utils/mail.utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const verifySchema = z.object({
    applicantName: z.string(),
    applicantEmail: z.string().email(),
    petName: z.string(),
    requestId: z.string(),
    userId: z.string(),
    shelterName: z.string(),
    shelterPhoneNumber: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = verifySchema.parse(body);
        const { applicantName, applicantEmail, petName, requestId, userId, shelterName, shelterPhoneNumber} = data

        const sender = {
            name: "Fur Ever Friends",
            address: "noreply@fureverfriends.com",
        };
        const recipients = [
            {
                name: applicantName,
                address: applicantEmail,
            },
        ];

        const route = `${process.env.BETTER_AUTH_URL}/customer-profile/${userId}?active=myEnquiries&requestId=${requestId}`;
        const result = await sendEmail({
            sender,
            recipients,
            subject: `Update on your application on ${petName}`,
            message: `
                <p>Hi ${applicantName},</p>

                <p>Congratulations!! The application you made to ${shelterName} for ${petName} was successful.</p><br/>
                <p>We are thrilled to inform you that your application has been approved! You can now proceed with the next steps in the adoption process.</p>
                <p>Reach out to ${shelterName} at <span style={{ color: 'blue' }>${shelterPhoneNumber} </span>regarding further steps in the adoption process.</p>

                <p>To view your application status and get more details about the shelter, please log in to your account and follow the link below:</p>
                <p><a href="${route}">View Application</a></p>
                <br/><br/>
                <p>We appreciate your commitment to providing a loving home for our furry friends. If you have any questions or need further assistance, feel free to reach out to us.</p>
                <p>Thank you for being a part of the Fur-Ever Friends community!</p>
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
