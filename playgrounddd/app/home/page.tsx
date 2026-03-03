"use client"

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

// derive session shape from the auth client so we don't have to stub with
// `{}` which trips the linter.
type Session = typeof authClient.$Infer.Session;
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";

export default function HomePage() {
    const router = useRouter();
<<<<<<< HEAD
    // undefined = not checked yet, null = checked and _not_ signed in, object = signed in
    const [session, setSession] = useState<Session | null | undefined>(undefined);

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            // data will be the session object or null if not signed in
            setSession(data ?? null);
=======
    const [session, setSession] = useState<null | { /* shape */ } | false>(null);

    useEffect(() => {
        authClient.getSession().then(({ data }) => {
            setSession(data ?? false);
>>>>>>> 89e549d225676b37acd0da30087e11f8a29a33bc
        });
    }, []);

    useEffect(() => {
<<<<<<< HEAD
        // only run when we know the outcome of the fetch
        if (session !== undefined && session === null) {
            // not logged in, send them to signin
=======
        // session loaded && no user -> redirect to signin
        if (session === false) {
>>>>>>> 89e549d225676b37acd0da30087e11f8a29a33bc
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
