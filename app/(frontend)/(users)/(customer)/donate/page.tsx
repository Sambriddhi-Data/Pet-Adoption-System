'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationInformationSchema, TDonationInformationSchema } from "../../_components/donation_system";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/loading-button";
import { toast } from "@/hooks/use-toast";


export default function DonatePage() {
  const [shelters, setShelters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const form = useForm<TDonationInformationSchema>({
    resolver: zodResolver(donationInformationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      amount: 10,
      shelterId: '',
      paymentMethod: 'Khalti',
    },
  })


  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch('/api/getShelters')
        const data = await res.json()
        setShelters(data)
      } catch (err) {
        console.error("Failed to fetch shelters:", err)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchShelters()
  }, [])

  if (initialLoading) return <p>Loading...</p>
  if (!shelters || shelters.length === 0) return <p>No shelters found.</p>

  async function onSubmit(values: TDonationInformationSchema) {
    console.log('Form submitted:', values)
    const formData = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phone,
      amount: values.amount,
      shelterId: values.shelterId, 
      paymentMethod: 'Khalti',
    }
    
    const res = await fetch('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      setLoading(false)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
      return
    }

    const data = await res.json()
    setLoading(false);

    if (data.payment_url) {
      window.location.href = data.payment_url // redirect to Khalti
    } else {
      alert('Something went wrong: ' + data.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Donate to a Shelter</h2>
      <p className="mb-4">Your donation will help us provide better care for the animals.</p>
      <p className="mb-4">Please fill out the form below to make a donation.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donation Amount (in NPR)</FormLabel>
                <FormControl>
                  <Input type="number"
                    required
                    placeholder="Donation Amount"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}

                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shelterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Shelter</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    required
                    className="w-full p-2 border rounded"
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">Select a Shelter</option>
                    {shelters.map(shelter => (
                      <option key={shelter.id} value={shelter.userId}>
                        {shelter.user.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton pending={loading}>
            {loading ? 'Processing...' : 'Donate via Khalti'}
          </LoadingButton>
        </form>
      </Form>
    </div>
  )
}
