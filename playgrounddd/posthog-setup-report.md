<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already partially set up (packages installed, `lib/posthog-server.ts` present, some `posthog.capture()` calls in place). The integration has been completed and enhanced:

- **Client initialization**: Updated `instrumentation-client.ts` to use the `/ingest` reverse proxy pattern. PostHog is initialized with `capture_exceptions: true` for automatic error tracking via the Next.js 15.3+ instrumentation approach.
- **Reverse proxy rewrites**: Added `/ingest` rewrites to `next.config.ts` pointing to the EU PostHog host (`eu.i.posthog.com`). `skipTrailingSlashRedirect` was already set.
- **Environment variables**: Confirmed and updated `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`.
- **New events added**: 5 new events supplementing the 8 that already existed across the codebase.
- **Server-side tracking**: `file_uploaded` is tracked server-side in the UploadThing handler using `posthog-node`.
- **User identification**: `posthog.identify()` and `posthog.reset()` are called at sign-in, sign-up, and sign-out.

| Event Name | Description | File |
|---|---|---|
| `sign_in_failed` | Sign-in attempt fails | `app/signin/page.tsx` |
| `user_signed_in` | User successfully signs in | `app/signin/page.tsx` |
| `sign_up_failed` | Sign-up attempt fails | `app/signup/page.tsx` |
| `user_signed_up` | User successfully signs up | `app/signup/page.tsx` |
| `password_change_clicked` | User clicks the Change Password button | `app/settings/page.tsx` |
| `password_changed` | User successfully completes a password change | `app/settings/page.tsx` |
| `password_reset_requested` | User requests a password reset email | `app/reset-password/page.tsx` |
| `password_reset_completed` | User completes setting a new password | `app/reset-password/page.tsx` |
| `auth_callback_error` | Auth callback page receives an error parameter | `app/callback/page.tsx` |
| `user_signed_out` | User signs out via the sidebar dropdown | `components/app-sidebar.tsx` |
| `file_uploaded` | User successfully uploads a profile picture (server-side) | `app/api/uploadthing/core.ts` |
| `meter_increased` | User clicks Increase on the Other page meter | `app/other/page.tsx` |
| `meter_reset` | User clicks Reset Meter on the Other page | `app/other/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/137433/dashboard/557635
- **Sign Up → Sign In → Home Funnel**: https://eu.posthog.com/project/137433/insights/sVlaxCLk
- **Authentication Events Over Time**: https://eu.posthog.com/project/137433/insights/UBgN1pZY
- **Auth Error Rate**: https://eu.posthog.com/project/137433/insights/q1B8rG60
- **Password Reset & Change Funnel**: https://eu.posthog.com/project/137433/insights/OC5FNDEm

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
