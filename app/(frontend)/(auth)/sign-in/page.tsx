import { Metadata } from "next";
import {SignIn} from "./signIn";

export const metadata: Metadata = {
  title: "Log In | Fur-Ever Friends"
}

export default function SignInPage() {
return <SignIn/>
}