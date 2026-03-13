import { betterAuth } from "better-auth";
import {Pool} from "pg"
import { haveIBeenPwned } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerification, sendOnPasswordReset, sendPasswordReset } from "./email";
import { testUtils } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"


const prisma = new PrismaClient({adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
    emailVerification:{
        sendVerificationEmail: async ( { user, url, token }, request) => {
            await sendEmailVerification(user.email, url, token)
        },
    },
    emailAndPassword:{
        enabled:true,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url, token}, request) => {
            await sendPasswordReset(user.email, url, token);
        },
        onPasswordReset: async ({ user }, request) => {
            await sendOnPasswordReset(user.email);
        },
    },
    plugins:[
        haveIBeenPwned(),
        nextCookies(),
        // Test-only helpers (factories/login/cookies/OTP capture). Do not use in production.
        testUtils({ captureOTP: true })
    ],





});