import { betterAuth } from "better-auth";
import {Pool} from "pg"
import { haveIBeenPwned } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerification, sendOnPasswordReset, sendPasswordReset } from "./email";
import { testUtils } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"
import { prisma } from "./db";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
    emailVerification:{
        sendVerificationEmail: async ( { user, url, token }, request) => {
            await sendEmailVerification(user.email, url, token)
        },
    },
    socialProviders: {
        google: { 
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
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
    plugins: process.env.NODE_ENV !== 'production' ? [haveIBeenPwned(),testUtils({ captureOTP: true }), nextCookies()] : [haveIBeenPwned(), nextCookies()],
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    trustedOrigins:[
        "https://danng-devpg11.vercel.app",
        "http://localhost:3000",
        "https://danng-dev-add-ui.vercel.app"
    ]
});