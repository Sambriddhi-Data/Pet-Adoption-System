import { z } from "zod";

export const adopterProfileSchema = z.object({
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

    age: z.boolean().refine((val) => val === true, {
        message: "You must confirm that your age is above 18 years.",
    }),

    image: z
        .array(z.string())
        .min(2, "At least two images are required")
        .max(4, "You can upload only upto four images"),

    userId: z
        .string(),

    home_situation: z
        .string()
        .min(1, { message: "This field is required" }),


    outside_space: z
        .string()
        .min(1, { message: "This field is required" }),

    household_setting: z
        .string()
        .min(1, { message: "This field is required" }),


    household_typical_activity: z
        .string()
        .min(1, { message: "This field is required" }),


    min_age: z
        .string()
        .min(2, { message: "Please enter the minimum age or No if you don't have a child in home." }),

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
        .string()
        .min(10, { message: "This field is required. Enter at least 10 characters" }),

    move_holiday: z
        .string()
        .min(10, { message: "This field is required. Enter at least 10 characters" }),

    experience: z
        .string()
        .min(10, { message: "This field is required. Enter at least 10 characters" }),

    agreement: z
        .boolean().default(false),

}).superRefine((data, ctx) => {
    if (data.other_animals) {
        if (!data.other_animals_info || data.other_animals_info.trim() === "") {
            ctx.addIssue({
                path: ["other_animals_info"],
                message: "This field is required",
                code: "custom",
            });
        }

        if (!data.neuter_status || data.neuter_status.trim() === "") {
            ctx.addIssue({
                path: ["neuter_status"],
                message: "Neuter status is required",
                code: "custom",
            });
        }
    }
});

export type TAdopterProfileSchema = z.infer<typeof adopterProfileSchema>

export const applyToAdoptSchema = z.object({
    message: z
        .string()
        .trim()
        .min(20, "Your personal message must be at least 20 characters long. Please share us your thoughts!"),
    userId:
        z.string()
})
export type TApplyToAdoptFormSchema = z.infer<typeof applyToAdoptSchema>

export const rehomePetSchema = z.object({
    species: z
        .string(),
    isBonded: z
        .boolean(),
    rehomeReason: z
        .array(z
            .string()).min(1, "Please select at least one reason for rehoming."),
    keepDuration: z
        .enum(["Less than 1 month", "1 month", "2 months", "Until a home is found"]),
    email: z
        .string().email("Please enter a valid email address."),
    name: z
        .string().min(2, "You name must be at least 2 characters long."),
    location: z
        .string(),
    phoneNumber: z
        .string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number."),
    isOver18: z
        .boolean().refine(val => val === true, "You must be over 18 to rehome a pet."),
    petName: z
        .string().min(1, "Pet's name must be at least 1 characters long."),
    image: z
        .array(z
            .string())
        .min(2, "At least two images are required")
        .max(4, "Upto four images are only allowed"),
});

export type TRehomePetSchema = z.infer<typeof rehomePetSchema>;