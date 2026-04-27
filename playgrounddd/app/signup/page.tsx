"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, Label, Input, Checkbox, useKumoToastManager } from "@cloudflare/kumo";
import { useEffect, useState } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react"
import { authClient } from "@/lib/auth-client";
type Session = typeof authClient.$Infer.Session;

import * as Sentry from "@sentry/nextjs"
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import ThemeToggle from "@/components/ThemeToggle";
import { SignInForm } from "@/components/login-form";
import Image from "next/image";



export default function SignUpPage(){

    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    const router = useRouter()

    useEffect(()=>{
        Sentry.addBreadcrumb({
            category: "auth",
            message: "Starting session retrieval for /home",
            level: "info"
        })

        authClient.getSession().then(({ data, error }) => {
            if(error){
                Sentry.captureException(error);
                setError(new Error(`Failed to retrieve session: ${error.message}`));
            }
            setSession(data ?? null);
        });
    }, [])
    
    useEffect(() =>{
        Sentry.addBreadcrumb({
            category:"auth",
            message: "Redirect proccess started",
            level: "info"
        })

        if(session !== undefined){
            if(session){
                router.push("/dashboard");
            }
            Sentry.captureException(new Error("Session not undefined but not true."))
        }
    }, [session, router])

    

    return (
        <main>
            <div className="flex  min-h-screen max-width w-full bg-white-100 font-sans dark:bg-black-100 dark:text-white-50">
                <div className="flex flex-col min-h-screen max-width bg-zinc-100 w-full md:w-5/12">
                    <SignInForm />
                </div>
                <div className="flex w-0 md:w-7/12 bg-orange-50 relative overflow-hidden invisible md:visible">
                    <Image 
                        src="/splash2.jpeg"
                        alt="bg"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </main>
    )

    
}