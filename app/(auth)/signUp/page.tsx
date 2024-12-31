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
import { signUpFormSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";

export default function SignUp() {
  //form.
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      phonenumber:"",
      email: "",
      password: "",
      
    },
  })

  // a submit handler.
  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    const { name, email, password } = values;
    const {data,error} = await authClient.signUp.email({
      email: email,
      password: password,
      name: name,
      callbackURL: "/signIn",
    },{
      onRequest: () => {
        toast({
          title: 'Signing up...'
        })
      },
      onSuccess: () => {
        form.reset()
      },
      onError: (ctx) => {
        toast({ title: ctx.error.message, variant: 'destructive' });
        form.setError('email', {
          type: 'manual',
          message: ctx.error.message
        })
      },
    });
  }

  return (
    <Card className="w-full max-w-md bg-white bg-opacity-85 shadow-lg px-4 ">
      <CardHeader className=" flex items-center justify-center">
        <CardTitle>Join Fur-Ever Friends Today!</CardTitle>
        <CardDescription>
          Sign up to search for your furever friend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href='/shelterSignUp' className='text-primary flex justify-end hover:underline'>
          Shelter SignUp
        </Link>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ramhettri C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="9000000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Password</FormLabel>
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
            <Button className="w-full" type="button">
              Sign in with google
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link href='/signIn' className='text-primary hover:underline'>
            Sign in now
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

