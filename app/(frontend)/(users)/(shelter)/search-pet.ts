import { z } from "zod";

export const searchPetsSchema = z.object({
    name: z
        .string()
        .optional(),

    species: z
        .string()
        .optional(),
    
    sex: z.string()
    .optional(),


    dominantBreed: z
        .string()
        .optional(),


    size: z
        .string()
        .optional(),

})

export type TSearchPetsForm = z.infer<typeof searchPetsSchema>;