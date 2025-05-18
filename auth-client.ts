import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL, // the base url of your server
  plugins: [
    inferAdditionalFields<typeof auth>(), 
    adminClient()
  ],
});
export const { admin, signIn, signUp, signOut, useSession, forgetPassword, resetPassword, revokeSession } = authClient;
