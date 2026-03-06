"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader, Button, ClipboardText } from "@cloudflare/kumo";
import { authClient } from "@/lib/auth-client";
import * as Sentry from "@sentry/nextjs";

// use the generated Session type; avoids lint complaining about `{}`.
type Session = typeof authClient.$Infer.Session;
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WarningCircleIcon } from "@phosphor-icons/react";


export default function CallbackPage() {
    // this component is marked as a client component above with "use client".
    // Avoid using an async component because that would trigger a server render
    // and Next will attempt to prerender it, which leads to the "useContext of
    // null" error when the client-only router is accessed during prerender.

    const router = useRouter();
    // undefined = still loading, null = checked and not signed in
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [errorP, setErrorP] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        // fetch session on the client only
        authClient.getSession().then(({ data, error }) => {
            setSession(data ?? null);
        });
        setErrorP(params.get("error"));
    }, []);

    useEffect(() => {
        // navigate once we know the result (may be null or an object)
        if(!errorP){
            if (session !== undefined) {
                router.push(session ? "/home" : "/signin");
            }
        }
    }, [session, router]);

        if (errorP) {
            
            const EID = Sentry.captureException(`Better-auth error occured: ${errorP}`)

            return (
                <div className="flex flex-col justify-center items-center bg-zinc-50 min-h-screen w-full font-sans dark:bg-black">
                    <main className="flex flex-col items-center gap-6">
                        <div >
                            <WarningCircleIcon size={64} color="red" weight="fill" />
                        </div>
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle className="text-red-600">Error</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300">{errorP}</p>
                                <div className="flex flex-grid gap-3">
                                    <p>Error ID: </p>
                                    <ClipboardText text={EID}/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => { window.location.href = "/signin" }}>Back to Sign In</Button>
                            </CardFooter>
                        </Card>
                    </main>
                </div>
            )
        }

    return(
        <div>
            <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
                <Card className="w-full text-center items-center">
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Loader size={48}/>
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}