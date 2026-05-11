import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function ForgotPasswordPage(){

    return (
        <main>
            <div className="min-h-screen w-full max-w overflow-hidden">
                <Image className="bg-img" alt="bg-img" src="shapes1.svg"/>
                <div></div>
                <div className="flex flex-col gap-4 align-center items-center justify-center text-white font-sans">
                    <Card className="bg-black rounded-md">
                        <CardHeader>
                            <CardTitle>Verify your email</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </main>
    )
}