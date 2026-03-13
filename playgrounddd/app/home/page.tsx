"use client"

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

// derive session shape from the auth client so we don't have to stub with
// `{}` which trips the linter.
type Session = typeof authClient.$Infer.Session;
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";

import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js";



export default function HomePage() {
    // client component - don't make it async!
    // pulling session in useEffect to avoid server-side prerender

    const router = useRouter();
    // undefined = not checked yet, null = checked and _not_ signed in, object = signed in
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [ notesEnabled, setNotesEnabled] = useState(false);

    posthog.onFeatureFlags(function() {
        if (posthog.isFeatureEnabled('betaFunctionaity') ) {
            setNotesEnabled(true);
        }
    })  

    useEffect(() => {
        Sentry.addBreadcrumb({
            category: "auth",
            message: "Starting session retrieval for /home",
            level: "info"
        })

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

    return (
        <SidebarProvider   style={
    {
      "--sidebar-width": "20rem",
      "--sidebar-width-mobile": "20rem",
    } as React.CSSProperties
  }>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SidebarTrigger />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}