"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardText } from "@cloudflare/kumo";
import { WarningOctagonIcon } from "@phosphor-icons/react";
import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
import { useState } from "react";
import posthog from "posthog-js";
import * as z from "zod"


export default function GlobalError({
  
  error,
}: {
  error: Error & { digest?: string };
}) {


  const [id, setId] = useState("Undefined")

  useEffect(() => {
    const id = Sentry.captureException(error);
    setId(id);

    posthog.capture("error",{
      sentryId: id,
      error: error
    })

    
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div>
          <main className="flex flex-col gap-6 max-w-full min-h-screen bg-zinc-50 font-sans items-center justify-center dark:bg-black">
            <WarningOctagonIcon size={64} color="red" />
            <Card>
              <CardHeader>
                <CardTitle>Error!</CardTitle>
                <CardDescription>An error has occured!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <p>An unexpected error has occured: {error.message}</p>
                  <div className="flex flex-grid gap-2">
                    <p>Distinct Id: </p>
                    <ClipboardText text={id}/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </body>
    </html>
  );
}
