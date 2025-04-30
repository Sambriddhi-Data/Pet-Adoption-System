import { z } from "zod";

export const  donationInformationSchema= z.object({

    name: z
        .string()
        .trim()
        .optional(),

    phone: z
        .string()
        .trim()
        .refine(val => val === '' || /^9\d{9}$/.test(val), {
            message: "Please enter a valid phone number"
        })
        .optional(),

    email: z
        .string()
        .trim()
        .refine(val => val === '' || z.string().email().safeParse(val).success, {
            message: "Please enter a valid email address"
        })

        .optional(),

    amount: z
    .coerce.number().min(5, "Amount must be at least 5"),

    shelterId: z
        .string(),
        
    paymentMethod: z
        .string()
        .trim()
        
})

export type TDonationInformationSchema = z.infer<typeof donationInformationSchema>

