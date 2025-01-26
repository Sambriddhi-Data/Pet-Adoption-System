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
import { signUpFormSchema } from "@/app/(frontend)/(auth)/auth-schema";
import { signUp } from "@/auth-client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import LoadingButton from "@/components/loading-button";


export default function SignUp() {

  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  type TSignUpForm = z.infer<typeof signUpFormSchema>

  const form = useForm<TSignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      phonenumber: "",
      email: "",
      password: "",
      confirmpassword: "",
      role:"CUSTOMER"
    },
  })
  console.log("Form",form.getValues())
  console.log(form.formState.errors)

  // a submit handler.
  async function onSubmit(values: TSignUpForm) {

    console.log("Submit",values)

    const { name, email, password,role } = values;
    const { data, error } = await signUp.email({
      email,
      password,
      name,
      role,
    }, {
      onRequest: () => {
        setPending(true);
      },
      onSuccess: () => {
        form.reset()
        toast({
          title: "Account created",
          description: "Your account has been successfully created. Please log In."
        })
        redirect("/sign-in");
      },
      onError: (ctx) => {
        toast({ title: ctx.error.message, variant: 'destructive' });
        form.setError('email', {
          type: 'manual',
          message: ctx.error.message
        })
      },
    });
    setPending(false);
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
        <Link href='/shelter-sign-up' className='text-primary flex justify-end hover:underline'>
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
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Re-enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <LoadingButton pending={pending}>Sign Up</LoadingButton>
          </form>
        </Form>

      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link href='/sign-in' className='text-primary hover:underline'>
            Sign in now
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

