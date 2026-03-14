import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authClient } from "@/lib/auth-client";
import { getPostHogClient } from "@/lib/posthog-server";
import * as Sentry from "@sentry/nextjs";

const f = createUploadthing();



// FileRouter for your app, can contain multiple FileRoutes
export const ddFileRouter = {
  profilePicture: f({
    image: {maxFileSize:"2MB", maxFileCount:1, minFileCount:1}
  })
  .middleware(async ({ req }) => {
    const session = await authClient.getSession();
    if(!session){
        throw new UploadThingError("You have to be logged in to do that")
    }

    return {userId: (await session).data?.user.id}
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Uploaded by user", metadata.userId);

    Sentry.addBreadcrumb({
      category: "generic",
      message: "Image uploaded",
      level: "info"
    })

    if (metadata.userId) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: metadata.userId,
        event: 'file_uploaded',
        properties: {
          file_url: file.ufsUrl,
          file_size: file.size,
          file_type: file.type,
          upload_type: 'profile_picture',
        },
      });
    }

    return{uploadedBy: metadata.userId, fileUrl: file.ufsUrl}
  })
} satisfies FileRouter;

export type fileRouter = typeof ddFileRouter;
