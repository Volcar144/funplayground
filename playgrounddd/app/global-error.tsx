"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardText } from "@cloudflare/kumo";
import { WarningCircleIcon } from "@phosphor-icons/react";
import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";
import posthog from "posthog-js";

export default function GlobalError({
  error,
  children
}: {
  error: Error & { digest?: string };
  children?: React.ReactNode;
}) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const sentryId = Sentry.captureException(error);
    setId(sentryId);

    posthog.capture("error", {
      sentryId,
      error: error
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div>
          <main className="flex flex-col gap-6 max-w-full min-h-screen bg-zinc-50 font-sans items-center justify-center dark:bg-black">
            <WarningCircleIcon size={64} color="red" />
            <Card>
              <CardHeader>
                <CardTitle>Error!</CardTitle>
                <CardDescription>An error has occurred!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <p>An unexpected error has occurred: {error.message}</p>
                  {id && (
                    <div className="flex flex-row gap-2 items-center">
                      <p>Incident ID:</p>
                      <ClipboardText text={id} />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-row gap-3">
                  {children}
                </div>
              </CardFooter>
            </Card>
          </main>
        </div>
      </body>
    </html>
  );
}