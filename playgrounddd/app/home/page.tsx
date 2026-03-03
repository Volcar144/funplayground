"use client"

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";

export default function HomePage() {
    const router = useRouter();
    const [session, setSession] = useState<null | { /* shape */ } | false>(null);

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            setSession(data ?? false);
        });
    }, []);

    useEffect(() => {
        // session loaded && no user -> redirect to signin
        if (session === false) {
            router.push("/signin");
        }
    }, [session, router]);

    if (session === null) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (session === false) {
        return null; // Will redirect
    }

    return (
        <SidebarProvider style={{
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SidebarTrigger />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
