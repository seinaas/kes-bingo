import Link from "next/link";
import { Suspense } from "react";

import { LatestPost } from "~/app/_components/post";
import { auth, SignedIn, SignedOut } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { NameInput } from "./_components/name";
import { BingoCard } from "./_components/bingoCard";

export default async function Home() {
  const session = await auth();
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Suspense>
            <SignedIn>
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl text-white">
                  Hello, {session?.user?.name}
                </p>
              </div>

              <LatestPost />
              <BingoCard />
            </SignedIn>
            <SignedOut>
              <NameInput />
            </SignedOut>
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
