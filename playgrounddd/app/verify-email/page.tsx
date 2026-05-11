import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ForgotPasswordPage(){

    return (
        <main>
            <div className="min-h-screen w-full max-w overflow-hidden">
                <Image className="bg-img" alt="bg-img" src="shapes1.svg"/>
                <div className="flex flex-grid gap-2">
                    <Image src="logo.svg" height={16} width={16} alt="logo" />
                    <p className="text-xl">Playground<b className="text-xl text-bold">dd</b></p>
                </div>
                <div className="flex flex-col gap-4 align-center items-center h-screen justify-center text-white font-sans">
                    <Card className="bg-black rounded-sm w-full ">
                        <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}