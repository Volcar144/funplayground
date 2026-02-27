"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@cloudflare/kumo";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { waitForDebugger } from "inspector";


export default function CallbackPage(){
    const useSession = authClient.useSession;
    const [isAuthorized, setIsAuthorized] = useState(true)

    if(!authClient.useSession){
        setIsAuthorized(false);
    }

    setTimeout("2000");

    if(isAuthorized){
        window.location.href="/home"
    } else {
        window.location.href="/signin"
    }



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