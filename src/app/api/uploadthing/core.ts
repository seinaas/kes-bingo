import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTFiles, UTFile } from "uploadthing/server";
import { auth } from "~/server/auth";
const f = createUploadthing();

export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ files, req }) => {
      // This code runs on your server before upload
      const session = await auth();
      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("Unauthorized") as Error;

      const image = files[0]!;
      const fileOverride = {
        ...image,
        name: session.user.id,
        customId: session.user.id,
      };

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id, [UTFiles]: [fileOverride] };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type MyFileRouter = typeof fileRouter;
