"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ForgotPasswordPage(){
    const [otp, setOtp] = useState("");

    async function submitForm(){

    }

    return (
        <main>
            <div className="min-h-screen w-full max-w overflow-hidden">
                <Image className="bg-img" alt="bg-img" src="splash1.png"/>
                <div className="flex flex-grid gap-2 text-white p-4">
                    <Image src="logo.svg" height={48} width={48} alt="logo" />
                    <p className="text-2xl">Playgrounddd</p>
                </div>
                <div className="flex flex-col gap-4 align-center items-center h-screen w-full justify-center font-sans">
                    <Card className="bg-black rounded-sm text-white w-1/5 opacity-70">
                        <CardHeader>
                            <CardTitle className="text-xl">Verify your email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="form-otp" onSubmit={submitForm}>
                                <FieldGroup>
                                    <Label htmlFor="form-otp-slots">Enter your One-Time-Code</Label>
                                    <Field id="form-otp-slots" >
                                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={setOtp}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </Field>
                                    <FieldDescription>Enter the code that was sent to your email</FieldDescription>
                                </FieldGroup>
                            </form>
                        </CardContent>
                        <CardFooter className="color-black">
                            <div className="flex flex-col rounded-none gap-2 w-full">
                                <Button className="w-full bg-green-500 focus:bg-green-400">Confirm</Button>
                                <Button className="w-full bg-grey-500 focus:bg-grey-200">
                                    <RotateCcw />
                                    Resend code
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    )
}