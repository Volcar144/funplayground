
import { createEndpoint, type BetterAuthPlugin } from "better-auth";

import { APIError, createAuthEndpoint, createAuthMiddleware } from "better-auth/api";
import { getId, getStats, parseId } from "./utils";

import { string, z } from "zod";
import { GetResult } from "@fingerprintjs/fingerprintjs";


export const fingerprintPlugin = () =>
({
    id: "FingerprintPlugin",
    schema: {
        user: {
            fields: {
                lastDeviceId:{
                    type: "string",
                    required: false,
                    unique: false
                },
            }
        }
    },
    endpoints: {
        getFingerprintToken: createAuthEndpoint("/fingerprints/dynamic", {
            method: "GET",
        }, async (ctx) => {
            return ctx.json(getId)
        }),
        getLastFingerPrint: createAuthEndpoint("/fingerprints/last", {
            method:"GET",
        }, async (ctx) =>{
            const db = await ctx.context.adapter;
            const user = ctx.context.session?.user
            const usrId = user?.id

            if(usrId == undefined || user == null){
                throw new APIError("UNAUTHORIZED")
            }

            const id = db.findOne({
                model: "user",
                where: [{
                    field: "id",
                    value: `${usrId}`,
                }],
                select: ["lastDeviceId"]
            })

            if(id == undefined || id == null){
                throw new APIError("NOT_FOUND");
            }

            return ctx.json(id);
        }),
        setLastFingerPrint: createAuthEndpoint("/fingerprints/set", {
            method: "POST",
            body: z.object({
                newFingerprint: z.string()
            })
        }, async (ctx) =>{
            const db = await ctx.context.adapter;
            const user = ctx.context.session?.user
            const id = user?.id
                    
            const fingerprint = await ctx.body.newFingerprint;

            db.update({
                model:"user",
                where: [{
                    field: "id",
                    value: `${id}`,
                }],
                update: [{
                    lastDeviceId: `${fingerprint}`
                }]
            })
        })
    },
    hooks:{
        after: [{
            matcher: (context) => {if(context){context.path?.startsWith("/sign-in") || context.path?.startsWith("/sign-up")} else {return false;} return false;},
            handler:
                createAuthMiddleware(async (ctx) =>{
                    const db = await ctx.context.adapter;
                    const user = ctx.context.session?.user
                    const id = user?.id
                    
                    const fingerprint = await getId();

                    db.update({
                        model:"user",
                        where: [{
                            field: "id",
                            value: `${id}`,
                        }],
                        update: [{
                            lastDeviceId: `${fingerprint}`
                        }]
                    })
                    
                    
                })
        }]
    }
        
        
} satisfies BetterAuthPlugin);