import { authClient } from "@/lib/auth-client";
import { NextResponse } from "next/server";

import * as sentry from "@sentry/nextjs"
import { prisma, PrismaD as Prisma } from "@/lib/db";

export async function GET(request: Request){
  const session = await authClient.getSession()
  if(!session){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const userId = await session.data?.user.id;

  if(!userId){
    sentry.captureException(new Error("User logged in but ID not found"))
    return NextResponse.json({error: `User logged in but ID not found`}, {status: 500, statusText: `Internal Server Error`})
  }

  try{
    const notes = await prisma.note.findMany({
        where:{
            userId: userId
        }
    })
    return NextResponse.json({notes}, {status: 200})
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