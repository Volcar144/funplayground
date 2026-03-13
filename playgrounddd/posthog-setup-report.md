<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already partially set up (packages installed, `lib/posthog-server.ts` present, `posthog.capture()` calls in place). The integration has been completed and corrected:

- **Client initialization**: Updated `instrumentation-client.ts` to use environment variables (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`) instead of hardcoded values. Added `capture_exceptions: true` for automatic error tracking, `ui_host` for the EU PostHog UI, and `debug` mode in development. Uses the Next.js 15.3+ `instrumentation-client.ts` pattern.
- **Reverse proxy rewrites**: Added `/ingest` rewrites to `next.config.ts` pointing to the EU PostHog hosts (`eu-assets.i.posthog.com`, `eu.i.posthog.com`). This avoids ad-blocker interference and improves data capture rates. `skipTrailingSlashRedirect` was already set.
- **Server-side client**: Updated `lib/posthog-server.ts` to use `NEXT_PUBLIC_POSTHOG_HOST` env var instead of a hardcoded host URL.
- **Environment variables**: Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local` with the correct EU host (`https://eu.i.posthog.com`).
- **Server-side tracking**: `file_uploaded` is tracked server-side in the UploadThing handler using `posthog-node`.
- **User identification**: `posthog.identify()` and `posthog.reset()` are called at sign-in, sign-up, and sign-out.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password | `app/signin/page.tsx` |
| `sign_in_failed` | User sign-in attempt fails | `app/signin/page.tsx` |
| `user_signed_up` | User successfully creates a new account | `app/signup/page.tsx` |
| `sign_up_failed` | User sign-up attempt fails | `app/signup/page.tsx` |
| `user_signed_out` | User signs out via the sidebar dropdown | `components/app-sidebar.tsx` |
| `password_changed` | User successfully changes their password in settings | `app/settings/page.tsx` |
| `password_change_clicked` | User clicks the Change Password button | `app/settings/page.tsx` |
| `file_uploaded` | User uploads a file (profile picture) via UploadThing (server-side) | `app/api/uploadthing/core.ts` |
| `password_reset_requested` | User requests a password reset email | `app/reset-password/page.tsx` |
| `password_reset_completed` | User successfully resets their password using a token | `app/reset-password/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/137433/dashboard/567165
- **Sign-Up to Sign-In Conversion Funnel**: https://eu.posthog.com/project/137433/insights/FXZz1f7y
- **Daily Active Users - Sign Ins & Sign Ups**: https://eu.posthog.com/project/137433/insights/APCiZ9ew
- **Auth Failure Rate - Sign In & Sign Up Errors**: https://eu.posthog.com/project/137433/insights/BezL24xX
- **Password Management Activity**: https://eu.posthog.com/project/137433/insights/DfE4vQBI
- **File Upload Activity**: https://eu.posthog.com/project/137433/insights/SbiShsAm

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
