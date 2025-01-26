import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma/client";
import { openAPI } from "better-auth/plugins";
import { sendEmail } from "./actions/email";

export const auth = betterAuth({
    user: {
        additionalFields: {
            role: {
                type: 'string',
            }
        }
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    plugins: [openAPI()], // api/auth/reference
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        }
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    // emailVerification: {
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: false,
    //     sendVerificationEmail: async ({ user, token }) => {
    //         const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
    //         await sendEmail({
    //             to: user.email,
    //             subject: 'Verify your email address',
    //             text: `Click the link to verify your email: ${verificationUrl}`
    //         })
    //     }

    // },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session
