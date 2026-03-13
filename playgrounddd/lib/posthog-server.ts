import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY!,
      {
        host: "eu.posthog.com",
        flushAt: 1,
        flushInterval: 0,
      }
    );
  }
  return posthogClient;
}
