"use client"

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";


export default function HomePage() {
    // client component - don't make it async!
    // pulling session in useEffect to avoid server-side prerender

    const router = useRouter();
    const [session, setSession] = useState<null | { /* shape */ }>(null);

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            setSession(data);
        });
    }, []);

    useEffect(() => {
        if (session !== null && !session) {
            // not logged in, send them to signin
            router.push("/signin");
        }
    }, [session, router]);

    return (
        <SidebarProvider   style={
    {
      "--sidebar-width": "20rem",
      "--sidebar-width-mobile": "20rem",
    } as React.CSSProperties
  }>
            <AppSidebar />
            <main>
                <SidebarTrigger></SidebarTrigger>
            </main>
        </SidebarProvider>
    )
}