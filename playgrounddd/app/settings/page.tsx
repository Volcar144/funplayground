"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Input, Surface, Button, useKumoToastManager } from "@cloudflare/kumo"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { error } from "console"

type Session = typeof authClient.$Infer.Session;

export default function SettingsPage(){
    const [loading1, setLoading1] = useState(false);
    const [ currentPass, setCurrentPass ] = useState("");
    const [ newPass, setNewPass ] = useState("");
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

    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SidebarTrigger />
                    <div className="flex flex-col gap-5 w-full max-h-screen bg-zic-50 font-sans items-center justify-center dark:bg-black">

                        <h1>Settings</h1>
                        <Surface>
                            <h3>Change Password</h3>
                            <p>Change your password</p>
                            <Input label="Current Password" value={currentPass} onValueChange={setCurrentPass} type="password" disabled={loading1}/>
                            <Input label="New Password" type="password" value={newPass} onValueChange={setCurrentPass} disabled={loading1}/>
                            <Button variant="primary" loading={loading1}></Button>
                        </Surface>

                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}