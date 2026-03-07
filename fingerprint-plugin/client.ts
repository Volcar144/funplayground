import type { BetterAuthClientPlugin } from "better-auth/client";
import { fingerprintPlugin } from ".";

export const fingerPrintClient = () => {
    return {
        id: "FingerprintPlugin",
        $InferServerPlugin: {} as ReturnType<typeof fingerprintPlugin>,
    } satisfies BetterAuthClientPlugin
}