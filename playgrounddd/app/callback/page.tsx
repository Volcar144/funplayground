"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@cloudflare/kumo";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function CallbackPage(){
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (isPending) return;

        if (session) {
            router.push("/home");
        } else {
            router.push("/signin");
        }
    }, [isPending, session, router]);



    return(
        <div>
            <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">

                <Card className="w-full">
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