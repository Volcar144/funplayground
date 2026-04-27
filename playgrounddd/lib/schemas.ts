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

export const signInSchema = z.object({
    email: z
        .email()
        .min(6, "Emails must be at least 6 characters.")
        .max(30, "To prevent spam, emails must be less than 30 characters long."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(64, "Passwords must not be longer than 64 characters.")
})

export const signUpSchema = z.object({
    name: z
        .string()
        .min(1, "Names must be at least 1 character")
        .max(20, "Names must not be longer than 20 characters"),
    email: z
        .email()
        .min(6, "Emails must be at least 6 characters.")
        .max(30, "To prevent spam, emails must be less than 30 characters long."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(64, "Passwords must not be longer than 64 characters."),
    passwordConfirm: z.string(),
})

export const otpSchema = z.object({
    code: z
        .string()
        .min(6, "OTP must be at least 6 digits.")
        .max(6, "OTP must be at most 6 digits.")
})