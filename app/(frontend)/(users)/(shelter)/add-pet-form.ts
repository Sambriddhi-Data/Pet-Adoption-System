import { z } from "zod";

export const addPetSchema = z.object({
    // Basic details
    name: z
        .string()
        .trim()
        .min(1, { message: 'Pet\'s name must be at least 1 character long' })
        .max(50, { message: 'Pet\'s name cannot exceed 50 characters' }),

    species: z
        .string()
        .min(3, { message: "Species name must be  atleast 3 characters long" }),

    gender: z
        .string(),

    status: z.enum(['available', 'adopted']),

    description: z
        .string()
        .trim()
        .min(7, { message: "Description name must be atleast 7 characters long" }),

    age: z
        .string()
        .trim()
        .optional(),

    dominantBreed: z
        .string(),

    size: z
        .string(),

    arrivedAtShelter: z
        .string(),

    shelterId: z
        .string(),

    //Health details

    

    





})