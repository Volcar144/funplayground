import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { EnvelopeIcon } from "@phosphor-icons/react"
import { useTheme } from 'next-themes';
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client"

export function SignInForm(){
    
    const {theme, setTheme} = useTheme();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password:"",
        }
    })

    async function onSubmit(input: z.infer<typeof signInSchema>){
        const { data, error } = await authClient.signIn.email({
            email: input.email,
            password: input.password,
            callbackURL: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/callback`
        },
        {
            onError(ctx) {
                if(ctx.error.statusText === "UNAUTHORIZED"){
                    form.setError("email", {
                        type:"custom",
                        message: ""
                    })
                    form.setError("password", {
                        type:"custom",
                        message: ctx.error.message
                    })
                
                }
            },
        }
    )
    }
    
    async function googleLogin(){

    }

    return (
        <div className="flex flex-col w-full max-w h-screen align-center items-center justify-center font sans">
            
            <div className=" w-3/5 min-h-9/12 rounded-md flex p-3 flex-col gap-4 align-center items-center ">
                <div >
                    <Image 
                        src="logo.svg"
                        alt="Playgrounddd logo"
                        height={100}
                        width={100}
                    />
                </div>
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome Back!</h1>
                    <p className="text-sm text-gray-500">
                        Let's get you logged back in!
                    </p>
                </div>
                <div className="text-base align-center w-full">
                    <form id="form-signin" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-signin-email">Email Address</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-email-signin"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="bob@example.com"
                                            type="email"
                                            autoCorrect="off"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}                    
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-signin-password">Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-signin-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="●●●●●●●●"
                                            type="password"
                                            autoCorrect="off"
                                            required
                                        />
                                        <FieldDescription>
                                            <a href="/reset-password">Forgot Password?</a>
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}                    
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                    <Field orientation={"vertical"} className="p-2">
                        <Button type="submit" form="form-signin" >
                            <EnvelopeIcon size={16} />
                            Sign in with Email
                        </Button>
                        <Button onClick={googleLogin}>
                            <FcGoogle size={16} />
                            Sign in with Google
                        </Button>
                    </Field>
                </div>
            </div>
        </div>
    )

}