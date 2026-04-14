"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { noteResponseSchema } from "@/lib/schemas"
import { Suspense, useEffect, useState } from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { WarningCircleIcon } from "@phosphor-icons/react/dist/icons/WarningCircle";
import GlobalError from "@/app/global-error";

export default function NotesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

    const [data, setData] = useState<Response>(new Response( null, {status: 500} ) );

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/notes/${(await params).slug}`);
            setData(data);
        };
        fetchData();
    }, [])


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

    if(!data.ok){
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

    
    const note = noteResponseSchema.parse( data )

    return (
        <main>
            <div className="flex flex-col items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                <Suspense>
                    <Card>
                    <CardHeader>
                        <CardTitle>{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
                </Suspense>
            </div>
        </main>
    )
}