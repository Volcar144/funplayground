import { betterAuth } from "better-auth";
import {Pool} from "pg"
import { haveIBeenPwned } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerification, sendOnPasswordReset, sendPasswordReset } from "./email";
import { testUtils } from "better-auth/plugins"


export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL
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