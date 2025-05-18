import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, APIError } from "better-auth/api";

import prisma from "./prisma/client";
import { admin } from "better-auth/plugins"
import { sendEmail } from "./utils/mail.utils";

export const auth = betterAuth({
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3000/?postAuth=true"
      ],
    user: {
        additionalFields: {
            user_role: {
                type: 'string',
            },
            location: {
                type: 'string',
                required: false,
            },
            phoneNumber: {
                type: 'string',
            },
            isVerifiedUser: {
                type: 'boolean',
            },
            isDeleted:{
                type: 'boolean',
            }
        }
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== "/sign-up/email") {
                return;
            }
            console.log("Payload:", ctx.body); // Log the payload

            const phoneNumber = ctx.body?.phoneNumber
            const existingUser = await prisma.user.findUnique({
                where: { phoneNumber },
            });
            if (existingUser) {
                // Throw error if phone number already exists
                throw new APIError("BAD_REQUEST", {
                    message: "Phone number is already in use",
                    path: ["phoneNumber"],
                });
            }

        }),
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"]
        }
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    session: {
        expiresIn: 60 * 60 * 24 * 3,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 2 * 60, 
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url, token}, request) => {
            await sendEmail({
                sender: {
                    name: "Fur-Ever Friends",
                    address: "no-reply@demomailtrap.com",
                },
                recipients: [{ name: user.name ?? "User", address: user.email }],
                subject: "Reset Your Password",
                message: `Click the link to reset your password: <a href="${url}">Reset Password</a> <br/> This link expires in 1 hour of the request. If the request has expired please request a new one. <br/> <br/>
                <p>Best regards,</p>
                <p>The Fur-Ever Friends Team</p>
                <p<strong>>Note: This is an automated message, please do not reply.</strong></p>
            `,
            });
        },
        resetPasswordTokenExpiresIn: 3600, // 1 hour
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: false,
        sendVerificationEmail: async ({ user, token }) => {
            const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;

            await sendEmail({
                sender: {
                    name: "Fur-Ever Friends",
                    address: "no-reply@demomailtrap.com",
                },
                recipients: [{ name: user.name ?? "User", address: user.email }],
                subject: "Verify your email address",
                message: `<h1>Welcome to Fur-Ever Friends</h1> You must verify your email to sign in to the website. Click the link to verify your email: <a href="${verificationUrl}">Verify Email</a><br/><br/> <br/> <br/>
                <p>Best regards,</p>
                <p>The Fur-Ever Friends Team</p>
                <p<strong>>Note: This is an automated message, please do not reply.</strong></p>
            `,
            });
        },
    },

    plugins: [
        admin({
            defaultRole: "customer",
        })
    ],

} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user;
