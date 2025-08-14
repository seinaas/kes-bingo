"use client";

import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Camera } from "lucide-react";
import {} from "@uploadthing/react";
import { uploadFiles } from "~/server/utils/uploadThing";
import { redirect } from "next/navigation";

export const UserInput = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (!image) return;
    // create the preview
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      await signIn("uuid", { name, redirect: false });

      if (image) {
        await uploadFiles((routeRegistry) => routeRegistry.imageUploader, {
          files: [image],
        });
      }

      redirect("/");
    },
    [image, name],
  );

  return (
    <form
      className="flex flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <div>
        <input
          type="file"
          id="userImage"
          capture="user"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        />
        <label
          htmlFor="userImage"
          className="flex h-48 w-48 items-center justify-center overflow-clip rounded-full bg-gray-400"
        >
          {preview ? (
            <img src={preview} className="h-full w-full object-cover" />
          ) : (
            <Camera size={64} />
          )}
        </label>
      </div>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">GO</button>
    </form>
  );
};
