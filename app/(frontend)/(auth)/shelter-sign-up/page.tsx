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
import { formSchema } from "@/app/(frontend)/(auth)/auth-schema";
import { signUp } from "@/auth-client";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"
import LoadingButton from "@/components/loading-button";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Checkbox } from "@/components/ui/checkbox";

interface UserWithPhoneNumber {
  id: string;
  phoneNumber: string;
}

export default function ShelterSignUp() {

  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [checkPhn, setCheckPhn] = useState<UserWithPhoneNumber | null>();

  const router = useRouter();

  type TShelterSignUpForm = z.infer<typeof formSchema>

  //form.
  const form = useForm<TShelterSignUpForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmpassword: "",
      user_role: "shelter_manager",
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
  async function onSubmit(values: TShelterSignUpForm) {

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

    const { name, email, password, user_role, location, phoneNumber } = values;
    console.log('Form values:', values);

    const { data, error } = await signUp.email({
      email: email,
      password: password,
      name: name,
      user_role: user_role,
      location: location,
      phoneNumber: phoneNumber,
      isVerifiedUser: false,
      isDeleted: false,
    }, {
      onRequest: () => {
        setPending(true);
      },
      onSuccess: () => {
        form.reset()
        toast({
          title: "Account Created",
          description: "Check your email for a verification link. Admin approval is required for shelter manager access and may take some time.",
          variant: "success"
        });
        router.push("/shelter-landing-page");
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
    <Card className="w-full max-w-md bg-white bg-opacity-85 shadow-lg px-4 mt-20">
      <CardHeader className=" flex items-center justify-center">
        <CardTitle>Join Fur-Ever Friends Today!</CardTitle>
        <CardDescription>
          Sign up to list shelter animals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Link href='/sign-up' className='text-primary flex justify-end last: hover:underline'>
          Customer SignUp
        </Link>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelter Name<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="SS Shelter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location<span style={{ color: 'red' }}> *</span></FormLabel>
                  <FormControl>
                    <Input placeholder="City name" {...field} />
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
                  <FormLabel> Phone number<span style={{ color: 'red' }}> *</span></FormLabel>
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
                  <FormLabel>Shelter Email<span style={{ color: 'red' }}> *</span></FormLabel>
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
                    <div className="relative">
                      <Input
                        type={showCPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCPassword(!showCPassword)}
                        className="absolute right-2 top-2"
                      >
                        {showCPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
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
                      I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <LoadingButton pending={pending}>
              Submit
            </LoadingButton>
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
