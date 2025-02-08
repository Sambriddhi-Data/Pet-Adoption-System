import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";
import { adminClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your server
    plugins: [
        inferAdditionalFields<typeof auth>(),
        adminClient(),
    ], 
});
// const signIn = async () => {
//     const data = await authClient.signIn.social({
//         provider: "google"
//     })
// }

export const {admin, signIn, signUp, signOut, useSession, forgetPassword} = authClient;
 