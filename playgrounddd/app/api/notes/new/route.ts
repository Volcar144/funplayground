import { NextRequest, NextResponse } from "next/server";
import { newNoteSchema } from "@/lib/schemas";
import * as sentry from "@sentry/nextjs"
import { auth } from "@/lib/auth";
import * as z from "zod"
import { prisma } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { getPostHogClient } from "@/lib/posthog-server";
import { headers } from "next/headers";
import { streamToString } from "@/lib/utils"

export async function POST(req: NextRequest){

    const posthog = getPostHogClient()

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session){
        return NextResponse.json({error: "Unauthorized"}, {status: 403})
    }

    const userId = await session.user.id;
    
    if(!userId){
        sentry.captureException(new Error("User logged in but ID could not be found"))
        return NextResponse.json({error: `User logged in but ID not found`}, {status: 500, statusText: `Internal Server Error`})
    }

    const body = await streamToString(req.body)
    let parsed: note = {title: "", content: ""}

    interface note{
        title: string,
        content: string
    }

    try {
        sentry.addBreadcrumb({
            category: "generic",
            message:"Parsing json"
        })
        parsed = JSON.parse(`${body}`)
    } catch (SyntaxError){
        sentry.captureException({SyntaxError})

        return NextResponse.json({error: "Payload not valid json"}, {status: 400} )
    }
    
    if(parsed.title === ""  || parsed.content === ""){
        return NextResponse.json({error: "Title or content canot be empty"}, {status: 400})
    }
    

    const obj = newNoteSchema.safeParse({
        title: parsed.title,
        content: parsed.content
    })
    if(!obj.success){
        const errorTree = z.treeifyError(obj.error)

        sentry.captureException(errorTree)
        sentry.logger.error(sentry.logger.fmt `${z.prettifyError(obj.error)}`, {
            error: 'ZodError',
            url: '/api/notes/new',
            userId: userId
        })

        return NextResponse.json({error: "Failed to parse JSON object"}, { status: 500 })
        
    }

    const id = uuid();

    let note

    try {
        note = await prisma.note.create({
            data: {
                id: id,
                userId: userId,
                title: obj.data.title,
                content: obj.data.content,
            },
            select: {
                updatedAt: true
            }
        })
    } catch (err){
    
        sentry.captureException(err)

        return NextResponse.json({error: "DB Operation Failed"}, {status: 500})
    }

    posthog.capture({
        distinctId: userId,
        event: "note_created",
        properties:{
            title: obj.data.title,
            length: obj.data.content.length,
        }
    })

    const time = await note.updatedAt

    return NextResponse.json({ message: `Success`, id: `${id}`, time: `${time}` }, {status: 200})
}