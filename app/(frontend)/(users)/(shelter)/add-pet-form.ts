import { z } from "zod";

export const petBasicDetailsSchema = z.object({
    // Basic details
    name: z
        .string()
        .trim()
        .min(1, { message: 'Pet\'s name must be at least 1 character long' })
        .max(50, { message: 'Pet\'s name cannot exceed 50 characters' }),

    species: z
        .string()
        .min(3, { message: "Species name must be  atleast 3 characters long" }),

    sex: z.enum(['Male', 'Female', 'Unknown']),

    status: z.enum(['available', 'processing', 'adopted']),

    age: z
        .string()
        .trim(),

    dominantBreed: z
        .string() || undefined,

    size: z
        .string(),

    // arrivedAtShelter: z
    //     .date({
    //         required_error: "A date of arrival is required.",
    //       }),

    shelterId: z
        .string(),

})
export type TPetBasicDetailsForm = z.infer<typeof petBasicDetailsSchema>;

//Health details
export const petHealthSchema = z.object({
    vaccinationStatus: z
        .enum(["vaccinated", "needsSecondVaccination", "notVaccinated", "unknown"])
        .optional(),

    neuteredStatus: z
        .enum(["neutered", "notNeutered", "pending"])
        .optional(),

    dateDewormed: z
        .string()
        .optional(),

    healthIssues: z
        .enum(["none", "blind", "deaf", "missing_limbs", "medication_required", "others"])
        .optional(),

    otherHealthIssues: z
        .string()
        .trim()
        .optional(),

    notes: z.string().optional()
})
export type TAddPetHealthForm = z.infer<typeof petHealthSchema>;


//Personality details
export const petPersonalitySchema = z.object({
    social: z
        .string()
        .max(200, { message: "Social description cannot exceed 100 characters" })
        .optional(),

    personalitySummary: z
        .string()
        .optional(),

    houseTrained: z
        .enum(["fully", "almost", "not_trained"])


})
export type TPetPersonalityForm = z.infer<typeof petPersonalitySchema>

export const petImagesForm = z. object ({
    image: z
    .array(z.string()).min(1, "At least one image is required"), 
})

export type TPetImagesForm = z.infer<typeof petImagesForm>;

export const formDataSchema = z.object({
    basicDetails: petBasicDetailsSchema,
    healthDetails: petHealthSchema,
    personalityDetails: petPersonalitySchema,
    petImages: petImagesForm
});

export type PetFormData = z.infer<typeof formDataSchema>;