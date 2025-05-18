import { sendEmail } from "@/utils/mail.utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const verifySchema = z.object({
    applicantName: z.string(),
    requestId: z.string(),
    applicantEmail: z.string().email(),
    petName: z.string(),
    userId: z.string(),
    shelterName: z.string(),
    shelterPhoneNumber: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = verifySchema.parse(body);
        const { applicantName, applicantEmail, petName, requestId, userId, shelterName, shelterPhoneNumber } = data

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

        const route = `${process.env.BETTER_AUTH_URL}/rehome-pet`;
        const route_status = `${process.env.BETTER_AUTH_URL}/customer-profile/${userId}?active=myEnquiries&requestId=${requestId}`;
        const result = await sendEmail({
            sender,
            recipients,
            subject: `Update on your rehome request to ${shelterName}`,
            message: `
                <p>Hi ${applicantName},</p>

                <p>Unfortunately on this occasion the application you made to ${shelterName} to rehome ${petName} wasn't successful.</p><br/>
                <p>We have a lot of other shelter, where you can request for rehoming your pet at <a href="${route}">www.fureverfriends.com</a> and we wish you luck in any future applications.</p>
                <p>Please remember the rescues receive a lot of applications for each animal so the applications with more information tend to stand out. Confirm your application status at <a href="${route_status}">View Request</a></p><br/>
                <p>Thank you for being a part of the Fur-Ever Friends community!</p>
                
                <br/>
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
