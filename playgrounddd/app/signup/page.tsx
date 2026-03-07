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
import { useState } from "react";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { authClient } from "@/lib/auth-client";
import * as Sentry from "@sentry/nextjs"
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
    const [name, setName] = useState("");
    const [rememeberMe, setRememberMe] = useState(false);
    const [success, setSuccess] = useState(false);

    
    

    function errorArea(){
        if(errorText.length != 0){
            return (
                <div className="flex flex-grid gap-1 text-red:50">
                    <WarningCircleIcon size={16} color="red" weight="fill"/>
                    <p color="red">{errorText}</p>
                </div>
            )
        }
    }

    async function onLoginButtonClick(){
        Sentry.addBreadcrumb({
            category: "actions",
            message: "Signup button Clicked",
            level: "info"
        })

        setLoading(true);
        setDisabled(true);

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
        
        const { data, error } = await authClient.signUp.email({
            name: name,
            email: email,
            password: password,
            callbackURL: `https://danng-devpg11.vercel.app/callback`
        },
        {
            onRequest: (ctx) => {
                setLoading(true);
                setDisabled(true);
            },
            onError: (ctx) => {
                setLoading(false);
                setDisabled(false);
                posthog.capture('sign_up_failed', {
                    error_message: ctx.error.message,
                });
                if(ctx.error.message == "Password is compromised"){
                    setErrorPass(true);
                    setErrorText("Password has been found in a data breach!")

                } else {
                    Sentry.captureException(`Sign-up error occured: ${ctx.error.message}`)
                    toastManager.add({
                        title:"Error!",
                        description:`An error occured: ${ctx.error.message}`,
                        variant:"error"
                    })
                }
            },
            onSuccess: (ctx) => {

                setLoading(false);
                setDisabled(false);
                setSuccess(true);
                posthog.identify(ctx.data.user.id, {
                    email: ctx.data.user.email,
                    name: ctx.data.user.name,
                });
                posthog.capture('user_signed_up', {
                    email: ctx.data.user.email,
                    name: ctx.data.user.name,
                });
                const session = authClient.useSession()

                while(!session.isPending){
                    Sentry.setUser({
                        email: session.data?.user.email,
                        id: session.data?.user.id,
                    })
                }

                Sentry.addBreadcrumb({
                    category: "auth",
                    message: "User signed up",
                    level: "info"
                })
            }
        },
    
    )
        
    }
    if(success){
        return (
            <div>
                <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">

                    <CheckCircleIcon color="green" size={64}/>
                    <Card className="w-full max-w-sm shadow-sm">
                        <CardHeader>
                            <CardTitle>Success!</CardTitle>
                            <CardDescription>Sign up has been successfull</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Success! Check your emails for a verification link so you can get started using your account</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full text-center" onClick={() => {window.location.href="/signin"}}>Return to sign-in</Button>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        )
    } else {
        return (
        <div>
            <main className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">

                <Card className="w-full max-w-sm shadow-sm">
                    <CardHeader>
                        <CardTitle>Create Your Account</CardTitle>
                        <CardDescription>Create your DanngDev playground account</CardDescription>
                        <CardAction><Button variant="ghost" onClick={() => {window.location.href="/signin"}}>Sign in</Button></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <Input type="text" label="Name" placeholder="Bob Jenkins" value={name} onValueChange={setName} disabled={disabled ? true : false} />
                            <Input type="email" label="Email" placeholder="bob@example.com" value={email} onValueChange={setEmail} variant={errorEmail ? "error" : "default"} disabled={disabled ? true : false}/>
                            <Input type="password" label="Password" placeholder="••••••••" value={password} onValueChange={setPassword} disabled={disabled ? true : false} variant={errorPass ? "error" : "default"}/>
                        </div>
                        <div className="flex flex-col">
                            {errorArea()}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-grid justify-right items-right w-full gap-6">
                            <Button type="submit" variant="primary" className="w-full text-center" size="lg"loading={loading ? true : false } onClick={onLoginButtonClick}>Create Account</Button>
                        </div>
                    </CardFooter>
                    

                </Card>

            </main>
        </div>
    )
    }
}