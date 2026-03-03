"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@cloudflare/kumo";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function CallbackPage() {
    // this component is marked as a client component above with "use client".
    // Avoid using an async component because that would trigger a server render
    // and Next will attempt to prerender it, which leads to the "useContext of
    // null" error when the client-only router is accessed during prerender.

    const router = useRouter();
    const [session, setSession] = useState<null | { /* shape if needed */ }>(null);

    useEffect(() => {
        // fetch session on the client only
        authClient.getSession().then(({ data, error }) => {
            setSession(data);
        });
    }, []);

    useEffect(() => {
        if (session !== null) {
            // once we know session state, navigate accordingly
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