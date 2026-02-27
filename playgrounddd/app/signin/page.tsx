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
import { WarningCircleIcon } from "@phosphor-icons/react"
import { authClient } from "@/lib/auth-client";
import { title } from "process";



export default function SignInPage(){
    const toastManager = useKumoToastManager();

    const [email, setEmail] = useState("bob@example.com");
    const [password, setPassword] = useState("••••••••");
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPass, setErrorPass] = useState(false)
    const [errorText, setErrorText] = useState("");
    const [rememeberMe, setRememberMe] = useState(false);
    

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
        
        const { data, error } = await authClient.signIn.email({
            email: email,
            password: password,
            rememberMe: rememeberMe,
            callbackURL: "https://sturdy-space-engine-v6677xq7gw99fx6j4-3000.app.github.dev/callback"
        },
        {
            onRequest: (ctx) => {
                setLoading(true);
                setDisabled(true);
            },
            onError: (ctx) => {
                if(ctx.error.message == "Password is compromised"){
                    setErrorPass(true);
                    setErrorText("Password has been found in a data breach!")
                } else {
                    toastManager.add({
                        title:"Error!",
                        description:`An error occured: ${ctx.error.message}`, 
                        variant:"error"
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
                        <CardAction><Button variant="ghost">Sign up</Button></CardAction>
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