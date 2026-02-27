import { betterAuth } from "better-auth";
import {Pool} from "pg"
import { haveIBeenPwned } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerification } from "./email";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL
    }),
    emailVerification:{
        sendVerificationEmail: async ( { user, url, token }, request) => {
            sendEmailVerification(user.email, url, token)
        },
    },
    emailAndPassword:{
        enabled:true,
        requireEmailVerification: true,
    },
    plugins:[
        haveIBeenPwned(),
        nextCookies()
    ],





});