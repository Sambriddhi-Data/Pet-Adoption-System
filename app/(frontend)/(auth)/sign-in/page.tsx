import { Metadata } from "next";
import {SignIn} from "./signIn";
import { auth } from '@/auth';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: "Log In | Fur-Ever Friends"
}

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers()
});

  return <SignIn/>;
}