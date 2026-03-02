"use client"

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";


export default function HomePage(){
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