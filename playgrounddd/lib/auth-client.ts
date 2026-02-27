import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "https://sturdy-space-engine-v6677xq7gw99fx6j4-3000.app.github.dev/api/auth"
})