"use client";

import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Camera } from "lucide-react";
import {} from "@uploadthing/react";
import { uploadFiles } from "~/server/utils/uploadThing";

export const UserInput = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

      if (isLoading) return;

      setIsLoading(true);

      await signIn("uuid", { name, redirect: false });

      if (image) {
        await uploadFiles((routeRegistry) => routeRegistry.imageUploader, {
          files: [image],
        });
      }

      window.location.reload();
    },
    [image, name, isLoading],
  );

  return (
    <form
      className="from-primary-900/50 to-primary-900/80 flex border-separate flex-col items-center justify-center gap-2 rounded-[300px_300px_30px_30px] bg-gradient-to-b p-2 shadow-xl"
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
          className="bg-primary-100/90 text-primary-900/50 mb-2 flex h-48 w-48 items-center justify-center overflow-clip rounded-full border-4"
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
        className="bg-primary-100/90 text-primary-900 rounded-lg p-2 px-4 outline-0"
      />
      <button
        type="submit"
        className="bg-accent-500 disabled:bg-accent-800 w-full cursor-pointer rounded-lg px-4 py-1.5 text-xl font-semibold disabled:cursor-default disabled:opacity-70"
        disabled={!name || isLoading}
      >
        {isLoading ? "Joining..." : "GO"}
      </button>
    </form>
  );
};
