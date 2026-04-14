"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { noteResponseSchema } from "@/lib/schemas"
import { Suspense, useEffect, useState } from "react"

import { useParams } from 'next/navigation'

import { WarningCircleIcon } from "@phosphor-icons/react/dist/icons/WarningCircle";
import GlobalError from "@/app/global-error";
import * as z from "zod"

export default function NotesPage() {

    const [data, setData] = useState<Response>(new Response( null, {status: 500} ) );
    const [error, setError] = useState<Error | null>(null);
    const params = useParams<{ id: string }>();

    console.log(`Fetching note with id: ${params.id}`)

    useEffect(() => {
        try {
            const fetchData = async () => {
                const data = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/notes/${params.id}`);
                setData(data);
                console.log(`Fetched data: `)
                console.log(data)
            };
            fetchData();
        } catch (err) {
            setError(err as Error);
        }
    }, [])

    if(error){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <GlobalError error={error} >
                        <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard/notes"}}>Go back to notes</Button>
                        <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard"}}>Go home</Button>
                    </GlobalError>
                </div>
            </main>
        )
    }


    console.log(data)
    if(data.status == 404){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <Suspense>
                        <WarningCircleIcon size={64} color="red" />
                        <Card>
                            <CardHeader>
                                <CardTitle>Could not find note!</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>You may have picked up the wrong piece of paper!</p>
                            </CardContent>
                            <CardFooter>
                                <div className="flex flex-grid gap-3">
                                    <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard"}}>Go home</Button>
                                    <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard/notes"}}>Go back to notes</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </Suspense>

                </div>
            </main>
        )
    }

    if(data.status >= 400){
        <main>
                <div className="flex flex-col w-full min-h-screen items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <Suspense>
                        <GlobalError error={new Error(`An unexpected error has occured while fetching the note: ${data.text}`)} >
                            <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard/notes"}}>Go back to notes</Button>
                            <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard"}}>Go home</Button>
                        </GlobalError>
                    </Suspense>

                </div>
            </main>
    }

    
    const note = noteResponseSchema.safeParse(data);

    if(!note.success){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <GlobalError error={new Error(`An unexpected error has occured while parsing the note: ${z.prettifyError(note.error)}`)} >
                        <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard/notes"}}>Go back to notes</Button>
                        <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard"}}>Go home</Button>
                    </GlobalError>
                </div>
            </main>
        )
    } 

    return (
        <main>
            <div className="flex flex-col items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                <Suspense>
                    <Card>
                    <CardHeader>
                        <CardTitle>{note.data.title}</CardTitle>
                    </CardHeader>
                    <CardContent>{note.data.content}</CardContent>
                </Card>
                </Suspense>
            </div>
        </main>
    )
}