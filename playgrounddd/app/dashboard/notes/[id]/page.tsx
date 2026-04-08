import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { noteResponseSchema } from "@/lib/schemas"
import { Suspense } from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

    const data = await fetch(`https://${process.env.NEXT_PUBLIC_APP_URL}/api/notes/${(await params).slug}`);

    if(data.status == 404){
        return (
            <main>
                <div className="flex flex-col w-full min-h-screen items-center justify-center align-center bg-zinc:50 font-sans dark:bg-black:100">
                    <Suspense>
                        <DotLottieReact 
                            src="Error.lottie"
                            autoplay
                            loop = {false}
                        />
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
                        <DotLottieReact 
                            src="Error.lottie"
                            autoplay
                            loop = {false}
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle>500: Server Error</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>An error has occ</p>
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
    }

    
    const note = await noteResponseSchema.parse( data )

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