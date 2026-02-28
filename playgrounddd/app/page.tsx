"use client"

import Image from "next/image";
import Loading from "../components/loading"
import { Button, Input, Surface, Text, PoweredByCloudflare, ClipboardText, SensitiveInput, Toasty, useKumoToastManager, Tooltip, TooltipProvider } from "@cloudflare/kumo";
import { TrashIcon, EnvelopeOpenIcon, CrossIcon, CopyrightIcon } from "@phosphor-icons/react"
import { Suspense } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import React from "react";


export default function Home() {
  const [foo, setFoo] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string>("Bob the builder");
  const toastManager = useKumoToastManager();

  function onNameButtonClick(){
    toastManager.add({
      title: "Success!",
      description: `Your name is ${name}`,
      variant: "default",
    })
  }

  React.useEffect(() => {
    fetch("https://dummyjson.com/c/3029-d29f-4014-9fb4")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setFoo(JSON.stringify(data)))
      .catch(err => {
        console.error("Failed to fetch data:", err);
        toastManager.add({
          title: "Error",
          description: "Failed to load data",
          variant: "error"
        });
      });
  }, [toastManager]);


  return (
    <>
      
      <Suspense fallback={<Loading />}>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            <div className="flex flex-col items-right align-top">
              <ThemeToggle />
            </div>
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <Surface className="p-6 rounded-lg">
              <Text size="lg" >Surface Component</Text>
              <Text variant="secondary" >
                A container with consistent elevation and border styling.
              </Text>
            </Surface>
            <Button
            size="lg" variant="secondary-destructive" icon={TrashIcon}
            >And now a button! </Button>

            <p>This data has been fetched: {foo || <Loading></Loading>}</p>
            
            <div className="flex gap-10"> 
              <p>And you can copy it! </p>
              <ClipboardText text={foo || " Loading"} />
            </div>
            <Text variant="secondary" >
                This is a clipboard component, click to copy the fetched data!
            </Text>
            <p>Then paste in here!</p>
            <Input placeholder="Paste here" aria-label="Paste"/>
            <p>Now for some wow effect, type your name below!</p>
            <SensitiveInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></SensitiveInput>
            <p>Press this button to tell you what your name is in a toast!</p>
            <Button onClick={onNameButtonClick} variant="primary" icon={<EnvelopeOpenIcon />}>A toast to {name}!</Button>
            <Button variant="destructive" onClick={() => {window.location.href="/404"}} icon={<CrossIcon/>}> Press on this button to go to my amazing 404 page!</Button>
            <Button variant="secondary" onClick={() => {window.location.href="/other"}}>Go to other</Button>
            </div>
          </main>
        </div>
        <footer>
          
          <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
             <PoweredByCloudflare /> <CopyrightIcon size={16} /><p className="text-black-50">2026 DanngDev</p>
          </div>
          
          
        </footer>
      </Suspense>
    </>
      

  );
}
