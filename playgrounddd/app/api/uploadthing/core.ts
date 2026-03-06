import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authClient } from "@/lib/auth-client";

const f = createUploadthing();

const session = await authClient.getSession();

// FileRouter for your app, can contain multiple FileRoutes
export const ddFileRouter = {
  profilePicture: f({
    image: {maxFileSize:"2MB", maxFileCount:1, minFileCount:1}
  })
  .middleware(async ({ req }) => {
    if(!session){
        throw new UploadThingError("You have to be logged in to do that")
    }

    return {userId: (await session).data?.user.id}
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Uploaded by user", metadata.userId);

    return{uploadedBy: metadata.userId, fileUrl: file.ufsUrl}
  })
} satisfies FileRouter;

export type fileRouter = typeof ddFileRouter;
