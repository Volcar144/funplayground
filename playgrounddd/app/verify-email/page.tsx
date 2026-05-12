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
                <Image className="bg-img" alt="bg-img" src="shapes1.svg"/>
                <div className="flex flex-grid gap-2 text-white p-4">
                    <Image src="logo.svg" height={64} width={64} alt="logo" />
                    <p className="text-2xl">Playgrounddd</p>
                </div>
                <div className="flex flex-col gap-4 align-center items-center h-screen w-full justify-center font-sans">
                    <Card className="bg-black rounded-sm text-white w-1/5">
                        <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="form-otp" onSubmit={submitForm}>
                                <FieldGroup>
                                    <Label htmlFor="form-otp-slots">Enter your One-Time-Code</Label>
                                    <Field id="form-otp-slots" >
                                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={setOtp}>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTP>
                                    </Field>
                                    <FieldDescription>Enter the code that was sent to your email</FieldDescription>
                                </FieldGroup>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Field orientation="horizontal" className="w-full">
                                <Button color="green">Enter code</Button>
                                <Button color="grey">
                                    <RotateCcw />
                                    Resend code
                                </Button>
                            </Field>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    )
}