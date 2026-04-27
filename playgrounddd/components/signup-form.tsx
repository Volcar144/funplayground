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
import { otpSchema, signUpSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"
import { Button } from "./ui/button"
import { EnvelopeIcon } from "@phosphor-icons/react"
import { useTheme } from 'next-themes';
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useRouter } from "next/navigation"

export function SignUpForm(){
    
    const {theme, setTheme} = useTheme();
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password:"",
            passwordConfirm:""
        }
    })

    const otp = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver( otpSchema ),
        defaultValues: {
            code: ""
        }
    })

    async function onSubmit(input: z.infer<typeof signUpSchema>){

        if(input.password != input.passwordConfirm){
            form.setError("password", {
                type: "custom",
                message:""
            })
            form.setError("passwordConfirm", {
                type: "custom",
                message:"Both passwords must match"
            })
        } else {
            setEmail(input.email);

            authClient.signUp.email({
                name: input.name,
                email: input.email,
                password: input.password
            }, {
                onError(ctx) {
                },
            })
            setSuccess(true);
            authClient.emailOtp.sendVerificationOtp({
                type: "email-verification",
                email: input.email
            })
        }
    }
    
    async function googleSignup(){
        
    }

    async function otpSumbit(input: z.infer<typeof otpSchema>){
        await authClient.emailOtp.checkVerificationOtp({
            email: email,
            otp: input.code,
            type: "email-verification"
        },{
            onError(ctx) {
              otp.setError("code", {
                type:"custom",
                message: `${ctx.error.message}`
              })      
              return;
            },
        })

        await authClient.emailOtp.verifyEmail({
            email: email,
            otp: input.code,
        }, {
            onError(ctx) {
              otp.setError("code", {
                type:"custom",
                message: `${ctx.error.message}`
              })      
              return;
            },
        })

        router.push("/signin")
        
    }

    if(success){
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
                    <h1 className="text-2xl font-semibold text-gray-900">Verify Your Email</h1>
                </div>
                <div className="text-base align-center w-full">
                    <form id="form-otp" onSubmit={otp.handleSubmit(otpSumbit)}>
                        <FieldGroup>
                            <Controller
                                name="code"
                                control={otp.control}
                                render={({field, fieldState}) => (
                                    
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-otp-code">Verification Code</FieldLabel>
                                        <InputOTP value={field.value} onChange={(value) => field.onChange(value)} onBlur={field.onBlur} aria-invalid={fieldState.invalid} maxLength={6} id="form-otp-code" pattern={REGEXP_ONLY_DIGITS} required>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3}/>
                                                <InputOTPSlot index={4}/>
                                                <InputOTPSlot index={5}/>
                                            </InputOTPGroup>
                                        </InputOTP>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}  
                                        <FieldDescription>The code that was sent to your email</FieldDescription>                  
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                    <Field orientation={"vertical"} className="p-2">
                        <Button type="submit" form="form-otp">Submit</Button>
                    </Field>
                </div>
            </div>
        </div>
        )
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
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome!</h1>
                    <p className="text-sm text-gray-500">
                        Create an account to get started!
                    </p>
                </div>
                <div className="text-base align-center w-full">
                    <form id="form-signup" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-signup-name">Full Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-signup-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="John Doe"
                                            type="name"
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
                                name="email"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-signup-email">Email Address</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-signup-email"
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
                                        <FieldLabel htmlFor="form-signup-password">Create a Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-signup-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="●●●●●●●●"
                                            type="password"
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
                                name="passwordConfirm"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-signup-passwordConfirm">Confirm Your Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-signup-passwordConfirm"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="●●●●●●●●"
                                            type="password"
                                            autoCorrect="off"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}                    
                                    </Field>
                                )}
                            />
                            
                        </FieldGroup>
                    </form>
                    <Field orientation={"vertical"} className="p-2">
                        <Button type="submit" form="form-signup" >
                            <EnvelopeIcon size={16} />
                            Sign up
                        </Button>
                        <Button onClick={googleSignup}>
                            <FcGoogle size={16} />
                            Sign Up with Google
                        </Button>
                    </Field>
                </div>
            </div>
        </div>
    )}
