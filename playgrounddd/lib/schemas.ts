import * as z from "zod"

export const newNoteSchema = z.object({
    title: z.string(),
    content: z.string()
})

export const noteResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    updatedAt: z.date()
})