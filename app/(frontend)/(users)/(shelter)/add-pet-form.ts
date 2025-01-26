import { z } from "zod";

export const addPetSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),

    location: z
        .string()
        .trim()
        .min(3, { message: "City name must be atleast 3 characters long" }),

    phonenumber: z
        .string()
        .trim()
        .regex(/^9\d{9}$/, { message: "Please enter a valid phone number" }),
})