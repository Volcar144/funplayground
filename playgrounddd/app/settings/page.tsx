"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Input, Surface, Button, useKumoToastManager } from "@cloudflare/kumo"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { error } from "console"
import GlobalError from "../global-error"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

type Session = typeof authClient.$Infer.Session;

export default function SettingsPage(){
    const [loading1, setLoading1] = useState(false);
    const [ currentPass, setCurrentPass ] = useState("");
    const [ newPass, setNewPass ] = useState("");
    const [error, setError] = useState<Error | null >(null);
    const toastManager = useKumoToastManager();

    
    const router = useRouter();
    // undefined = not checked yet, null = checked and _not_ signed in, object = signed in
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    
    useEffect(() => {
       authClient.getSession().then(({ data }) => {
            // data will be the session object or null if not signed in
            setSession(data ?? null);
            });
        }, []);
    
        useEffect(() => {
            // only run when we know the outcome of the fetch
            if (session !== undefined && session === null) {
                // not logged in, send them to signin
                router.push("/signin");
            }
    }, [session, router]);

    async function changePass(){
        authClient.changePassword({
            currentPassword:currentPass,
            newPassword:newPass,
            revokeOtherSessions: true,
            fetchOptions: {
                onError(context) {
                    setError(context.error)
                },
            }
        }, )
    }

    async function passwordChangeButton(){
        setLoading1(true);

        toastManager.promise( changePass(),{
            success: {title: "Success!", description: "Successfully chenged password, please log in again"},
            loading: {title: "Loading", description: "Please wait..."},
            error: {title: "Error!", description:`An error occured while changing your password!`}
        })

        setLoading1(false);

        authClient.signOut();
        router.push("/signin")
    }

    if(error != null){
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <GlobalError error={error}></GlobalError>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SidebarTrigger />
                    <div className="flex flex-col gap-5 w-full max-h-screen bg-zic-50 font-sans items-center justify-center dark:bg-black">

                        <h1 className="text-3xl">Settings</h1>
                        <Card className="w-3/5">
                            <CardHeader>
                                <CardTitle className="text-xl">Reset Password</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input label="Current Password" value={currentPass} onValueChange={setCurrentPass} type="password" disabled={loading1}/>
                                <Input label="New Password" type="password" value={newPass} onValueChange={setNewPass} disabled={loading1}/>
                            </CardContent>
                            <CardFooter>
                                <Button variant="primary" loading={loading1} onClick={passwordChangeButton}>Change Password</Button>
                            </CardFooter>
                        </Card>

                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}