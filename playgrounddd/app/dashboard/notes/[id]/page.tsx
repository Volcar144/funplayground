"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { noteResponseSchema } from "@/lib/schemas"
import { useEffect, useState } from "react"

import { useParams } from 'next/navigation'

import { WarningCircleIcon } from "@phosphor-icons/react/dist/icons/WarningCircle";
import GlobalError from "@/app/global-error";
import * as z from "zod"
import * as Sentry from "@sentry/nextjs";

import { Skeleton } from "@/components/ui/skeleton"

type NoteData = {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
} | null;

type FetchState = {
    data: NoteData;
    status: number;
    isLoading: boolean;
}

export default function NotesPage() {

    const [fetchState, setFetchState] = useState<FetchState>({
        data: null,
        status: 0,
        isLoading: true
    });
    const [error, setError] = useState<Error | null>(null);
    const params = useParams<{ id: string }>();

    console.log(`Fetching note with id: ${params.id}`)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/notes/${params.id}`);
                
                if (response.ok) {
                    // API returns { notes: { id, title, content, updatedAt } }
                    const json = await response.json();
                    setFetchState({
                        data: {
                            id: json.notes.id,
                            title: json.notes.title,
                            content: json.notes.content,
                            updatedAt: new Date(json.notes.updatedAt) // Had to parse like this to prevent the date from becoming a String
                        },
                        status: response.status,
                        isLoading: false
                    });
                    console.log(`Fetched data: `, json);
                } else {
                    // Handle non-OK responses
                    setFetchState({
                        data: null,
                        status: response.status,
                        isLoading: false
                    });
                }
            } catch (err) {
                console.error("Error fetching note:", err);
                setError(err as Error);
                Sentry.captureException(err);
                setFetchState(prev => ({ ...prev, isLoading: false }));
            }
        };
        
        fetchData();
    }, [params.id]) // Added params.id to dependency array

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

    if (fetchState.isLoading) {
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <Card>
                        <CardHeader>
                            <CardTitle><p>Loading...</p></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex w-ful max-w-xs flex-col gap-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full mt-2" />
                                <Skeleton className="h-4 w-full mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        )
    }

    if(fetchState.status === 404){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen max-w-2xl items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <WarningCircleIcon size={64} color="red" />
                    <Card>
                        <CardHeader>
                            <CardTitle>Could not find note!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>You may have picked up the wrong piece of paper!</p>
                        </CardContent>
                        <CardFooter>
                            <div className="flex flex-grid gap-2">
                                <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard"}}>Go home</Button>
                                <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard/notes"}}>Go back to notes</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        )
    }

    if(fetchState.status >= 400){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen max-w-2xl items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <GlobalError error={new Error(`An unexpected error has occurred while fetching the note. Status: ${fetchState.status}`)} >
                        <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard/notes"}}>Go back to notes</Button>
                        <Button variant={"link"} className="w-full" onClick={() => {window.location.href = "/dashboard"}}>Go home</Button>
                    </GlobalError>
                </div>
            </main>
        )
    }

    
    const note = noteResponseSchema.safeParse(fetchState.data);

    if(!note.success){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen max-w-2xl items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <GlobalError error={new Error(`An unexpected error has occurred while parsing the note: ${z.prettifyError(note.error)}`)} >
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
                <Card>
                    <CardHeader>
                        <CardTitle>{note.data.title}</CardTitle>
                    </CardHeader>
                    <CardContent>{note.data.content}</CardContent>
                </Card>
            </div>
        </main>
    )
}