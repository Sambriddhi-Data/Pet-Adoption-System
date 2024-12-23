import { z } from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),

    location: z
        .string()
        .min(3, { message: "City name must be atleast 3 characters long" }),

    phonenumber: z
        .string()
        .regex( /^9\d{9}$/, { message: "Please enter a valid phone number" }),

    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .min(2)
        .max(50),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" })

})
export const signInFormSchema = formSchema.pick({
    email: true,
    password: true
})

export const signUpFormSchema = formSchema.pick({
    name: true,
    email: true,
    phonenumber: true,
    password: true
})
