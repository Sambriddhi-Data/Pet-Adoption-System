'use client'

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInFormSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function SignIn() {
  //form.
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // a submit handler.
  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/customerHomepage",
      },
      {
        onRequest: () => {
          toast({ title: 'Signing In...' });
        },
        onSuccess: () => {
          form.reset();
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Submit
              </Button>
              <h3 className="flex items-center justify-center">----------- OR -----------</h3>
              <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account yet?{' '}
            <Link href="/signUp" className="text-primary hover:underline">
              Sign up now
            </Link>
          </p>
        </CardFooter>
      </Card>
  );
}