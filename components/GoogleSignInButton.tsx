'use client'
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth-client"; 
import { toast } from "@/hooks/use-toast"; 
import { useRouter } from "next/navigation";

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const router = useRouter();
    const loginWithGoogle = async () => {
        try {
          toast({ title: "Redirecting to Google..." }); 
          
          await signIn.social(
            {
              provider: "google", 
              errorCallbackURL:"/api/auth/error",
            },
            {
              onRequest: () => {
                toast({ title: "Processing request..." });
              },
              onSuccess: () => {
              },
              onError: (ctx) => {
                if (ctx.error?.message === "unable_to_create_user") {
                  router.push("/no-user"); // ✅ Redirect to specific page
                }
                
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
