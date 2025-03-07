import { z } from "zod";


export const lostPetFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'Pet\'s name must be at least 1 character long' })
        .max(50, { message: 'Pet\'s name cannot exceed 50 characters' }),

    phoneNumber: z
        .string()
        .trim()
        .regex(/^9\d{9}$/, { message: "Please enter a valid phone number" }),

    location: z
        .string()
        .trim()
        .min(3, { message: "City name must be atleast 3 characters long" }),

    description: z
        .string()
        .trim()
        .min(7, { message: "Description name must be atleast 7 characters long" }),

    image: z
        .array(z.string()).min(1, "At least one image is required"), 

})

export type  TLostPetFormSchema = z.infer<typeof lostPetFormSchema>

