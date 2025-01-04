import { FC, ReactNode } from "react";
import { Button } from "./button";
import { authClient } from "@/lib/auth-client"; 
import { toast } from "@/hooks/use-toast"; 

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
    const loginWithGoogle = async () => {
        try {
          toast({ title: "Redirecting to Google..." }); // Notify user (optional)
          
          // Adjust authClient configuration to include prompt parameter
          await authClient.signIn.social(
            {
              provider: "google", // Specify the provider as "google"
              callbackURL: "/shelterHomepage", // Redirect after login
            },
            {
              onRequest: () => {
                toast({ title: "Processing request..." });
              },
              onSuccess: () => {
                toast({ title: "Sign-in successful!" });
              },
              onError: (ctx) => {
                toast({ title: ctx.error.message, variant: "destructive" });
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
