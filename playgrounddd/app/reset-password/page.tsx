"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@cloudflare/kumo";
import { useEffect, useState } from "react";
import { EmailSyntax } from 'email-syntax';
import { WarningCircleIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import { Suspense } from "react";
import { CheckCheckIcon } from "lucide-react";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";


export default function ResetPasswordPage() {

    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [errorP, setErrorP] = useState<string | null>(null);
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get("token"));
        setErrorP(params.get("error"));
    }, []);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [erorText, setError] = useState("");
    const [password, setPassword] = useState("");

    
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    function errorText() {

        if (erorText.length != 0) {
            return (
                <div>
                    <div className="flex flex-grid gap-1 text-red:50">
                        <WarningCircleIcon size={16} color="red" weight="fill" />
                        <p color="red" className="text-red:50">{erorText}</p>
                    </div>
                </div>
            )
        }

    }

    if (errorP) {
        return (
            <div className="flex flex-col justify-center items-center bg-zinc-50 min-h-screen w-full font-sans dark:bg-black">
                <main className="flex flex-col items-center gap-6">
                    <div className="animate-spin">
                        <WarningCircleIcon size={64} color="red" weight="fill" />
                    </div>
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-red-600">Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300">{errorP}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => { window.location.href = "/signin" }}>Back to Sign In</Button>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        )
    }

    async function passwordButtonSubmit() {

        setLoading(true);
        setError("");

        if (!EmailSyntax.validate(email)) {
            setError("Invalid Email");
            setLoading(false);
            return;
        }

        setStatus('sending');

        const { data, error } = await authClient.requestPasswordReset({
            email: email,
            redirectTo: "https://danng-devpg11.vercel.app/reset-password"
        })

        setLoading(false);

        if (error) {
            setError(`${error.message}`);
            setStatus('idle');
        } else {
            setStatus('sent');
        }
    }

    function renderIntermediate(){
        return(
            <div className="flex flex-col justify-center items-center bg-zinc-50 min-h-screen w-full font-sans dark:bg-black">
                <main className="flex flex-col items-center gap-6">
                    <div >
                        <CheckCheckIcon size={64} color="green" />
                    </div>
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle >Success</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300">
                                If there is an account accosiated with it, a password reset email has been sent to  {email}!
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => { window.location.href = "/signin" }}>Back to Sign In</Button>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        )
    }

    async function newPasswordButton(){

        setLoading(true);
        setError("");

        if (!token) {
            setError("Missing or invalid token");
            setLoading(false);
            return;
        }

        const { data,error } = await authClient.resetPassword({
            token: `${token}`,
            newPassword: password
        })

        setLoading(false);
        
        if(error){
            setError(`${error.message}`)
        }

        router.push("/signin");

    }



    if (!token) {
        // when the user has already submitted the form, show the success page
        if (status === 'sent') {
            return renderIntermediate();
        }

        return (
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
                <div className="flex flex-col justify-center items-center bg-zinc:50 min-h-screen w-full font-sans dark:bg-black">
                    <main>
                        <Card>
                            <CardHeader>
                                <CardTitle>Reset your password</CardTitle>
                                <CardDescription>Reset your password using the form below</CardDescription>
                                <CardAction><Button variant="ghost" onClick={() => { window.location.href = "/signin" }}>Sign in</Button></CardAction>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                <Input label="Enter your email" type="email" labelTooltip="This is the email you used to sign in with" placeholder="bob@example.com" content={email} onValueChange={setEmail} disabled={loading ? true : false} variant={erorText.length != 0 ? "error" : "default"} />
                                <div>
                                    {errorText()}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" type="submit" loading={loading ? true : false} onClick={passwordButtonSubmit}>Submit</Button>
                            </CardFooter>
                        </Card>
                    </main>
                </div>
            </Suspense>
        )
    } else {
        return (
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
                <div className="flex flex-col justify-center items-center bg-zinc:50 min-h-screen w-full font-sans dark:bg-black">
                    <main>
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose your password</CardTitle>
                                <CardDescription>Enter your new password using the form below</CardDescription>
                                <CardAction><Button variant="ghost" onClick={() => { window.location.href = "/signin" }}>Sign in</Button></CardAction>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                <Input label="Enter your new password" type="password" placeholder="••••••••" content={password} onValueChange={setPassword} disabled={loading ? true : false} variant={erorText.length != 0 ? "error" : "default"} />
                                <div>
                                    {errorText()}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" type="submit" loading={loading ? true : false} onClick={newPasswordButton}>Submit</Button>
                            </CardFooter>
                        </Card>
                    </main>
                </div>
            </Suspense>
        )
    }

}