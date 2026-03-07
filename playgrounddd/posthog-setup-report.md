<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DanngDev playground app. PostHog is now initialized via `instrumentation-client.ts` using the Next.js 15.3+ pattern, with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) is available for future API route instrumentation. Eight events are now tracked across five pages, covering the full auth lifecycle: sign-up, sign-in, failures, password recovery, and callback errors. Users are identified at login and sign-up via `posthog.identify()` with their user ID, email, and name.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password | `app/signin/page.tsx` |
| `sign_in_failed` | User attempted to sign in but encountered an error | `app/signin/page.tsx` |
| `user_signed_up` | User successfully created a new account | `app/signup/page.tsx` |
| `sign_up_failed` | User attempted to sign up but encountered an error | `app/signup/page.tsx` |
| `password_change_clicked` | User clicked the Change Password button on the settings page | `app/settings/page.tsx` |
| `password_reset_requested` | User submitted the password reset request form with their email | `app/reset-password/page.tsx` |
| `password_reset_completed` | User submitted a new password via the reset link token | `app/reset-password/page.tsx` |
| `auth_callback_error` | Auth callback page received an error parameter | `app/callback/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/114496/dashboard/557301
- **Sign Up → Sign In Funnel**: https://eu.posthog.com/project/114496/insights/7cxqjZkY
- **Daily Sign Ups & Sign Ins**: https://eu.posthog.com/project/114496/insights/owgQOqS6
- **Auth Failure Rate**: https://eu.posthog.com/project/114496/insights/Dua4aPrZ
- **Password Recovery Activity**: https://eu.posthog.com/project/114496/insights/gCOTtRbt
- **Auth Callback Errors**: https://eu.posthog.com/project/114496/insights/oFrD0P56

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
