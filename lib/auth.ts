import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma,{
        provider: "postgresql"
    }),
    emailAndPassword: {  
        enabled: true,
    },
    // socialProviders: {
    //     autoSignIn: false,
    //     google: { 
    //         clientId: '1057347288323-9otv96hv7v5g8irpqpm46m2qe08dbl1m.apps.googleusercontent.com', 
    //         clientSecret: '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',
    //     }
    // }
})