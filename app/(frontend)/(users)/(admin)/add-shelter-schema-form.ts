import { z } from "zod";


export const baseSchema = z.object({
    name: z
        .string()
        .trim(),

    location: z
        .string()
        .trim()
        .min(3, { message: "City name must be atleast 3 characters long" }),

    phonenumber: z
        .string()
        .trim()
        .regex( /^9\d{9}$/, { message: "Please enter a valid phone number" }),

    email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address" })
        .min(2)
        .max(50),

    password: z
        .string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" }),

    confirmpassword: z
        .string()
        .trim()
        .min(8, { message: "Passwords did not match" }),
    role: z
    .enum(["admin","CUSTOMER","SHELTER_MANAGER"])
    
})
