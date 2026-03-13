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
import { EmailSyntax } from 'email-syntax';
import { useEffect, useState } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react"
import { authClient } from "@/lib/auth-client";
type Session = typeof authClient.$Infer.Session;

import * as Sentry from "@sentry/nextjs"
import { useRouter } from "next/navigation";
import posthog from "posthog-js";



export default function SignInPage(){
    const toastManager = useKumoToastManager();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPass, setErrorPass] = useState(false)
    const [errorText, setErrorText] = useState("");
    const [rememeberMe, setRememberMe] = useState(false);
    const [session, setSession] = useState<Session | null | undefined>(undefined);

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
            }
            setSession(data ?? null);
        });
    })
    
    useEffect(() =>{
        Sentry.addBreadcrumb({
            category:"auth",
            message: "Redirect proccess started",
            level: "info"
        })

        if(session !== undefined){
            if(session){
                router.push("/home");
            }
            Sentry.captureException(new Error("Session not undefined but not true."))
        }
    })

    

    function errorArea(){
        if(errorText.length != 0){
            return (
                <div className="flex flex-grid gap-1 text-red:50">
                    <WarningCircleIcon size={16} color="red" weight="fill"/>
                    <p color="red" className="text-red">{errorText}</p>
                </div>
            )
        }
    }

    async function onLoginButtonClick(){
        setLoading(true);
        setDisabled(true);

        Sentry.addBreadcrumb({
            category: "actions",
            message: "Login button Clicked",
            level: "info"
        })

        if(!EmailSyntax.validate(email)){
            setErrorEmail(true);
            setErrorText("Email invalid")
            setLoading(false);
            setDisabled(false);
            return;
        }

        if(password.length < 8){
            setErrorPass(true);
            setErrorText("Password must be over 8 characters long!");
            setLoading(false);
            setDisabled(false);
            return;
        }
        
        const { data, error } = await authClient.signIn.email({
            email: email,
            password: password,
            rememberMe: rememeberMe,
            callbackURL: `https://danng-devpg11.vercel.app/callback`
        },
        {
            onRequest: (ctx) => {
                setLoading(true);
                setDisabled(true);
            },
            onError: (ctx) => {
                posthog.capture('sign_in_failed', {
                    error_message: ctx.error.message,
                });
                if(ctx.error.message == "Password is compromised"){
                    setErrorPass(true);
                    setErrorText("Password has been found in a data breach!")
                } else {
                    Sentry.addBreadcrumb({
                        category: "auth",
                        message: `Generic auth error occured: ${ctx.error.message}`,
                        level: "warning"
                    })

                    toastManager.add({
                        title:"Error!",
                        description:`An error occured: ${ctx.error.message}`,
                        variant:"error"
                    })
                    setLoading(false);
                    setDisabled(false);
                }
            },
            onSuccess :(context)  =>{
                setLoading(false);
                setDisabled(false);
                posthog.identify(context.data.user.id, {
                    email: context.data.user.email,
                    name: context.data.user.name,
                });
                posthog.capture('user_signed_in', {
                    email: context.data.user.email,
                    remember_me: rememeberMe,
                });
                const session = authClient.useSession()

                while(!session.isPending){
                    Sentry.setUser({
                        email: session.data?.user.email,
                        id: session.data?.user.id,
                    })
                }
            },
        },
    
    )
        
    }

    return (
        <div>
            <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">

                <Card className="w-full max-w-sm shadow-sm">
                    <CardHeader>
                        <CardTitle>Sign in to your account</CardTitle>
                        <CardDescription>Sign in to continue to the homepage</CardDescription>
                        <CardAction><Button variant="ghost" onClick={() => {window.location.href="/signup"}}>Sign up</Button></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <Input type="email" label="Email" placeholder="bob@example.com" value={email} onValueChange={setEmail} variant={errorEmail ? "error" : "default"} disabled={disabled ? true : false}/>
                            <Input type="password" label="Password" placeholder="••••••••" value={password} onValueChange={setPassword} disabled={disabled ? true : false} variant={errorPass ? "error" : "default"}/>
                            <Checkbox 
                            label="Remember Me?"
                            controlFirst={false}
                            checked={rememeberMe}
                            onCheckedChange={setRememberMe}
                            />
                        </div>
                        <div className="flex flex-col">
                            {errorArea()}
                        </div>
                        <div className="text-gray:50">
                           <p>Forgot password?</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-grid justify-right items-right w-full gap-6">
                            <Button type="submit" variant="primary" className="w-full text-center" size="lg"loading={loading ? true : false } onClick={onLoginButtonClick}>Log In</Button>

                        </div>
                    </CardFooter>
                    

                </Card>

            </main>
        </div>
    )
}