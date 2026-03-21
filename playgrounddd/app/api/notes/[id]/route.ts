import { NextResponse } from "next/server";
import { prisma, PrismaD as Prisma} from "@/lib/db"
import * as sentry from "@sentry/nextjs"
import * as z from "zod"
import { newNoteSchema } from "@/lib/schemas";
import { getPostHogClient } from "@/lib/posthog-server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { streamToString } from "@/lib/utils";


const posthog = getPostHogClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if(!session){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const userId = await session.user.id;

  if(!userId){
    return NextResponse.json({error: `User logged in but ID not found`}, {status: 500, statusText: `Internal Server Error`})
  }

  try {
    const notes = await prisma.note.findFirst({
      where: {id: id},
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true
      }
    })
    return NextResponse.json({notes}, {status: 200});
  } catch (err){
    if (err instanceof Prisma.PrismaClientKnownRequestError){
      if(err.code == "P1000"){
        sentry.captureException(err);
        return NextResponse.json({error: "Authentication to db failed"}, { status:500 })
      } else if(err.code == "P1001" || err.code == "P1002"){
        sentry.captureException(err)
        return NextResponse.json({ error: "Failed to reach DB"}, {status: 500})
      } else if (err.code.startsWith("P20")){
        sentry.captureException(err)
        return NextResponse.json({error: "DB Error occured" },{ status:500 })
      }
      sentry.captureException(err)
      return NextResponse.json({error: "Unknown DB error occured"} , {status:500})
    }
    sentry.captureException(err)
    return NextResponse.json({error:"Internal Server Error"} , {status:500})
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const userId = await session.user.id; 

  if (!userId) {
    sentry.captureException(new Error("User logged in but ID not found"));
    return NextResponse.json({ error: `User logged in but ID not found` }, { status: 500, statusText: `Internal Server Error` });
  }

  try {
    await prisma.note.delete({
      where: {
        id: id
      }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P1000") {
        sentry.captureException(err);
        return NextResponse.json({ error: "Authentication to db failed" }, { status: 500 });
      } else if (err.code == "P1001" || err.code == "P1002") {
        sentry.captureException(err);
        return NextResponse.json({ error: "Failed to reach DB" }, { status: 500 });
      } else if (err.code.startsWith("P20")) {
        sentry.captureException(err);
        return NextResponse.json({ error: "DB Error occured" }, { status: 500 });
      }
      sentry.captureException(err);
      return NextResponse.json({ error: "Unknown DB error occured" }, { status: 500 });
    }
    sentry.captureException(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  posthog.capture({
    distinctId: userId,
    event: "note_deleted",
    properties:{
      noteID: id,
    }
  })

  return NextResponse.json({ message: "success" }, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const userId = session.user.id; 

  if (!userId) {
    sentry.captureException(new Error("User logged in but ID not found"));
    return NextResponse.json({ error: `User logged in but ID not found` }, { status: 500, statusText: `Internal Server Error` });
  }

  const body = await streamToString(request.body)
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
  
          return NextResponse.json({error: "Failed to parse JSON object due to invalid request body"}, { status: 400 })
          
      }

  try {
    // Add await here!
    await prisma.note.update({
      where:{
        id:id
      },
      data:{
        content: obj.data.content,
        title: obj.data.title,
      }
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P1000") {
        sentry.captureException(err);
        return NextResponse.json({ error: "Authentication to db failed" }, { status: 500 });
      } else if (err.code == "P1001" || err.code == "P1002") {
        sentry.captureException(err);
        return NextResponse.json({ error: "Failed to reach DB" }, { status: 500 });
      } else if (err.code.startsWith("P20")) {
        sentry.captureException(err);
        return NextResponse.json({ error: "DB query error occured" }, { status: 500 });
      }
      sentry.captureException(err);
      return NextResponse.json({ error: "Unknown DB error occured" }, { status: 500 });
    }
    sentry.captureException(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  posthog.capture({
    distinctId: userId,
    event: "note_updated",
    properties:{
      noteID: id,
      title: obj.data.title
    }
  })

  return NextResponse.json({ message: "success" }, { status: 200 });
}
