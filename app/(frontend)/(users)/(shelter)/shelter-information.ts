import { z } from "zod";

export const shelterInformationSchema = z.object({
    userId: z
        .string()
        .trim(),
                
    name: z
        .string()
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),

    location: z
        .string()
        .trim()
        .min(3, { message: "City name must be atleast 3 characters long" }),

    phoneNumber: z
        .string()
        .trim()
        .regex( /^9\d{9}$/, { message: "Please enter a valid phone number" }),

    email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address" })
        .min(2)
        .max(50),
    shelterDesc: z
        .string()
        .trim()
        .min(100, { message: 'Description must be at least 100 characters long' })
        .max(500, { message: 'Description cannot exceed 500 characters' }),
    
    image: z
        .string()
        .optional()
        .or(z.literal(""))


})

export type TShelterInformation = z.infer<typeof shelterInformationSchema>