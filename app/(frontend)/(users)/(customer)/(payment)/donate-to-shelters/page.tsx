"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LoadingButton from "@/components/loading-button"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { donationInformationSchema, TDonationInformationSchema } from "../../_components/donation_system"

export default function DonatePage() {
  const form = useForm<TDonationInformationSchema>({
    resolver: zodResolver(donationInformationSchema),
    defaultValues: {
      purchase_order_id: "1234200000",
      return_url: "http://localhost:3000", 
      product_name: "book", 
      customer_name: "Sam",
      customer_phone: "9800000000",
      customer_email: "sam@gmail.com",
      amount: 12,
      payment_id: "",
      message: "",
      payment_url: "",
    },
  })


  const [pending, setPending] = useState(false);

  async function onsubmit(values: TDonationInformationSchema) {
    setPending(true);
    console.log("clicked");

    // Prepare the payload
    const payload = {
      purchase_order_id: values.purchase_order_id,
      return_url: values.return_url,
      product_name: values.product_name,
      customer_name: values.customer_name,
      customer_phone: values.customer_phone,
      customer_email: values.customer_email,
      amount: values.amount * 100,
    };
    console.log(payload);

    try {
      // Send the POST request
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(payload),
      });

      // Parse the response
      const data = await response.json();

      // Check for successful payment initia tion
      if (response.ok) {
        // Redirect the user to the payment URL
        console.log("Full response:", data);
        const paymentUrl = data.request?.payment_url;
        console.log(paymentUrl)
        window.location.href = paymentUrl;
      } else {
        // Handle error (you can show a message or perform other actions)
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className='p-6 space-y-4'>
        <h1 className='text-2xl font-bold underline'> Shelter Information </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="purchase_order_id"
              render={({ field }) => (
                <FormItem className="flex items-center justify-left gap-10 border-b">
                  <FormLabel className="text-md w-20 pb-1">ID</FormLabel>
                  <FormControl>
                    <Input className="border-none shadow-none my-4" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem className="flex items-center justify-left gap-10 border-b">
                  <FormLabel className="text-md w-20 pb-1">Shelter Name</FormLabel>
                  <FormControl>
                    <Input className="border-none shadow-none my-4" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="return_url"
              render={({ field }) => (
                <FormItem className="flex items-center justify-left gap-10 border-b">
                  <FormLabel className="text-md w-20 pb-1">URL</FormLabel>
                  <FormControl>
                    <Input className="border-none shadow-none my-4" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem className="flex items-center justify-left gap-10 border-b">
                  <FormLabel className="text-md w-20 pb-1">Email</FormLabel>
                  <FormControl>
                    <Input className="border-none shadow-none my-4" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex items-center justify-left gap-10 border-b">
                  <FormLabel className="text-md w-20 pb-1">Amount</FormLabel>
                  <FormControl>
                    <Input className="border-none shadow-none my-4" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center w-64">
              <LoadingButton pending={pending}>
                Donate
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
