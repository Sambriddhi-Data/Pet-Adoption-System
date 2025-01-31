'use client'
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth-client"; 
import { toast } from "@/hooks/use-toast"; 

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
    const loginWithGoogle = async () => {
        try {
          toast({ title: "Redirecting to Google..." }); 
          
          await signIn.social(
            {
              provider: "google", 
              callbackURL:"/",
              errorCallbackURL:"/api/auth/error",
            },
            {
              onRequest: () => {
                toast({ title: "Processing request..." });
              },
              onSuccess: () => {
              },
              onError: (ctx) => {
                toast({ title: "Cannot find user!",
                  description: "Please Sign Up First." });
              },
            }
          );
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          toast({
            title: "Sign-In Failed",
            description: "Unable to sign in with Google.",
            variant: "destructive",
          });
        }
      };      

  return (
    <Button onClick={loginWithGoogle} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
