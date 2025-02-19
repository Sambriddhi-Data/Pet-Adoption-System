'use client';

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import { signInFormSchema, TSignInForm } from "@/app/(frontend)/(auth)/auth-schema";
import { toast } from "@/hooks/use-toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import { signIn, useSession } from "@/auth-client";

export const SignIn = () => {

  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const session = useSession();
  const role = session?.data?.user?.user_role;

  useEffect(() => {
    if (session?.data?.user?.role) {
      // Handle shelter manager verification check
      if (role === "shelter_manager") {
        if (!session.data.user.isVerifiedUser) {
          toast({
            title: "Your shelter has not been verified yet!",
            description: "Please wait for the admin to verify your shelter credentials."
          });
          router.push("/shelter-landing-page");
          return;
        }
      }

      toast({ title: "Sign In Successful..." });
      switch (role) {
        case "customer":
          router.push("/");
          break;
        case "shelter_manager":
          router.push("/shelter-homepage");
          break;
        case "admin":
          router.push("/admin-homepage");
          break;
        default:
          toast({ title: "Unknown role", variant: "destructive" });
      }
    }
  }, [session, router]);
  //form.
  const form = useForm<TSignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // a submit handler.
  async function onSubmit(values: TSignInForm) {
    const { email, password } = values;
    // console.log("Submit",values)
    const { data, error } = await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          form.reset();
          toast({
            title: "Sign In Successful!!",
            variant: "success"
          });

        },
        onError: (ctx) => {
          toast({ title: ctx.error.message, variant: 'destructive' });
          form.setError('email', {
            type: 'manual',
            message: ctx.error.message,
          });
        },
      }
    );
    setPending(false);
  }

  return (
    <Card className="w-full max-w-md bg-white bg-opacity-85 shadow-lg px-4 ">
      <CardHeader className="flex items-center justify-center">
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Please sign in to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="abc@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <LoadingButton pending={pending}>
              Submit
            </LoadingButton>
          </form>
          <h3 className="flex items-center justify-center ">----------- OR -----------</h3>
        </Form>
        <GoogleSignInButton><Image
          src='/images/google_g_icon.svg'
          alt='paw'
          width={30}
          height={30}
        />Sign in with Google</GoogleSignInButton>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account yet?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};