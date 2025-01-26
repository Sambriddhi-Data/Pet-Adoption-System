import { z } from "zod";

export const addPetSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),

    species: z
        .string()
        .trim()
        .min(3, { message: "Soecies name must be atleast 3 characters long" }),

})