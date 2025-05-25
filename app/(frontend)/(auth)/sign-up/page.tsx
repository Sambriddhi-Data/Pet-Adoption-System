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
import { signUpFormSchema } from "@/app/(frontend)/(auth)/auth-schema";
import { signUp } from "@/auth-client";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import Image from "next/image";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Checkbox } from "@/components/ui/checkbox";

interface UserWithPhoneNumber {
  id: string;
  phoneNumber: string;
}

export default function SignUp() {

  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPhn, setCheckPhn] = useState<UserWithPhoneNumber | null>();

  type TSignUpForm = z.infer<typeof signUpFormSchema>

  const form = useForm<TSignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmpassword: "",
      user_role: "customer",
      termsAgreed: false
    },
  })

  const phoneNumber = form.watch("phoneNumber");
  // check if the phone number already exists in the database.
  useEffect(() => {
    if (!phoneNumber) return;

    const fetchPhoneNumber = async () => {
      try {
        const response = await fetch(API_ROUTES.getPhoneNumbers(phoneNumber));
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCheckPhn(data);
      } catch (error) {
        console.error("Error fetching user with phone number:", error);
        toast({
          title: "Error",
          description: "Failed to check phone number availability.",
          variant: "destructive",
        });
      }
    };

    fetchPhoneNumber();
  }, [phoneNumber]);


  // a submit handler.
  async function onSubmit(values: TSignUpForm) {

    if (checkPhn) {
      form.setError("phoneNumber", {
        type: "manual",
        message: "This phone number is already in use. Please enter a different one.",
      });

      toast({
        title: "Phone number is already in use",
        description: "Please enter a different phone number.",
        variant: "destructive",
      });
      setPending(false);
      return; // Prevent form submission
    }

    const { name, email, password, user_role, phoneNumber } = values;
    const { data, error } = await signUp.email({
      email,
      password,
      phoneNumber,
      name,
      user_role: user_role,
      isVerifiedUser: false,
      isDeleted: false,
    }, {
      onRequest: () => {
        setPending(true);
      },
      onSuccess: () => {
        form.reset();
        toast({
          title: "Account created",
          description: "Check your email for a verification link to activate your account..",
          variant: "success"
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
    <Card className="w-full max-w-md bg-white bg-opacity-85 shadow-lg px-4 mt-16">
      <CardHeader className=" flex items-center justify-center">
        <CardTitle>Join Fur-Ever Friends Today!</CardTitle>
        <CardDescription>
          Sign up to search for your furever friend.
        </CardDescription>
      </CardHeader>
      {/* 
        <div className= "p-2 px-6 flex justify-between items-center bg-slate-200 opacity-80 rounded-sm">
        <CardDescription>Are you a shelter manager? <br/>Please use this link:</CardDescription>
        <Link href='/shelter-sign-up' className='text-primary font-bold justify-end hover:underline'> Shelter SignUp</Link>
      </div>
       */}
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
              name="phoneNumber"
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
            <FormField
              control={form.control}
              name="termsAgreed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-500 font-normal">
                      I agree to the <Link href="/terms-of-service" className="text-primary hover:underline " target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</Link>.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <LoadingButton pending={pending}>Sign Up</LoadingButton>
          </form>
        </Form>
        <h3 className="flex items-center justify-center ">----------- OR -----------</h3>

        <GoogleSignInButton><Image
          src='/images/google_g_icon.svg'
          alt='paw'
          width={30}
          height={30}
        />Sign up with Google</GoogleSignInButton>
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

