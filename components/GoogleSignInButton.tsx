"use client";
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "@/auth-client";

interface GoogleSignInButtonProps {
  children: ReactNode;
}

// Google Sign-In Function
export const loginWithGoogle = async () => {
  try {
    const data = await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/?postAuth=true`,
      newUserCallbackURL:"/new-user"
    });

    console.log("Google Sign-In Response:", data);

    if (data?.error) {
      throw new Error;
    }

    return data;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      toast({ title: "Redirecting to Google..." });

      const result = await loginWithGoogle(); 

      if (result?.error) {
        throw new Error(result.error);
      }      
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);

      if (error.message === "unable_to_create_user") {
        router.push("/no-user"); 
      } else {
        toast({
          title: "Sign-In Failed",
          description: "Unable to sign in with Google.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button onClick={handleGoogleSignIn} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
