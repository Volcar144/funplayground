"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@cloudflare/kumo";
import { authClient } from "@/lib/auth-client";

// use the generated Session type; avoids lint complaining about `{}`.
type Session = typeof authClient.$Infer.Session;
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function CallbackPage() {
    // this component is marked as a client component above with "use client".
    // Avoid using an async component because that would trigger a server render
    // and Next will attempt to prerender it, which leads to the "useContext of
    // null" error when the client-only router is accessed during prerender.

    const router = useRouter();
    // undefined = still loading, null = checked and not signed in
    const [session, setSession] = useState<Session | null | undefined>(undefined);

    useEffect(() => {
        // fetch session on the client only
        authClient.getSession().then(({ data, error }) => {
            setSession(data ?? null);
        });
    }, []);

    useEffect(() => {
        // navigate once we know the result (may be null or an object)
        if (session !== undefined) {
            router.push(session ? "/home" : "/signin");
        }
    }, [session, router]);



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