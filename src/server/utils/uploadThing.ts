import { generateReactHelpers } from "@uploadthing/react";
import type { MyFileRouter } from "~/app/api/uploadthing/core";
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<MyFileRouter>();
