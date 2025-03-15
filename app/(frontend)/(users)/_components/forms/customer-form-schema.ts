import { z } from "zod";

export const applyToAdoptSchema = z.object({
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

    age: z.boolean().default(false).optional(),

    image: z
        .array(z.string()).min(2, "At least two images are required"),

    userId: z
        .string(),

    home_situation: z
        .string(),

    outside_space: z
        .string(),

    household_setting: z
        .string(),

    household_typical_activity: z
        .string(),

    min_age: z
    .number()
    .int()
    .min(0, { message: "Age of child must be at least 0." })
    .max(18, { message: "Age of child must be at most 18." }),

    flatmate: z
        .boolean().default(false),

    allergy: z
        .boolean().default(false),

    other_animals: z
        .boolean().default(false),
    other_animals_info: z
        .string().optional(),
    neuter_status: z
        .string().optional(),

    lifestyle: z
        .string(),
    move_holiday: z
        .string(),
    experience: z
        .string(),
    agreement: z
        .boolean().default(false),
    other_information: z
        .string(),


}).superRefine((data, ctx) => {
    if (data.other_animals) {
        if (!data.other_animals_info || data.other_animals_info.trim() === "") {
            ctx.addIssue({
                path: ["other_animals_info"],
                message: "This field is required when 'Other Animals' is selected.",
                code: "custom",
            });
        }

        if (!data.neuter_status || data.neuter_status.trim() === "") {
            ctx.addIssue({
                path: ["neuter_status"],
                message: "Neuter status is required when 'Other Animals' is selected.",
                code: "custom",
            });
        }
    }
});

export type TApplyToAdoptSchema = z.infer<typeof applyToAdoptSchema>

export const applyToRehomeSchema = z.object({
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
    species: z.string(),

    email: z
        .string()
        .trim()
        .email({ message: "Please enter a valid email address" })
        .min(2)
        .max(50),

})
