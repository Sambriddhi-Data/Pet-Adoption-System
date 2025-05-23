import { z } from "zod";

export const baseSchema = z.object({
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
        .regex(/^9\d{9}$/, { message: "Please enter a valid phone number" }),

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

    user_role: z
        .enum(["admin", "customer", "shelter_manager"]),

    termsAgreed: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and privacy policy."
    })

})

export const formSchema = baseSchema.refine(
    (data) => data.password === data.confirmpassword,
    {
        path: ["confirmpassword"],
        message: "Passwords do not match",
    }
);

export const signInFormSchema = baseSchema.pick({
    email: true,
    password: true,
})
export type TSignInForm = z.infer<typeof signInFormSchema>

export const signUpFormSchema = baseSchema.pick({
    name: true,
    email: true,
    phoneNumber: true,
    password: true,
    confirmpassword: true,
    user_role: true,
    termsAgreed: true,
}).refine(
    (data) => data.password === data.confirmpassword,
    {
        path: ["confirmpassword"],
        message: "Passwords do not match",
    }
);


export const forgotPasswordSchema = baseSchema.pick({
    email: true,
})

export const resetPasswordSchema = baseSchema.pick({
    password: true,
    confirmpassword: true,
})
    .refine((data) => data.password === data.confirmpassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });