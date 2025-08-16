import { Suspense } from "react";

import { auth, SignedOut } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { UserInput } from "./_components/userInput";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.user.getUsers.prefetch();

  if (session?.user.id) {
    redirect(`/user/${session.user.id}`);
  }

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        <Suspense>
          <SignedOut>
            <UserInput />
          </SignedOut>
        </Suspense>
      </main>
    </HydrateClient>
  );
}
