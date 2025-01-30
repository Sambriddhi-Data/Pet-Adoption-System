import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
import { adminClient } from "better-auth/client/plugins";


const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server
    plugins: [
        inferAdditionalFields<typeof auth>(),
        adminClient(),
    ], 
})

export const {admin, signIn, signUp, signOut, useSession, forgetPassword} = authClient;
 