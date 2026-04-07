import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { noteResponseSchema } from "@/lib/schemas"
import { Suspense } from "react"

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

    const data = await fetch(`https://${process.env.NEXT_PUBLIC_APP_URL}/api/notes/${(await params).slug}`);
    
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