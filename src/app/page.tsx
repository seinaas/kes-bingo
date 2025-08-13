import { Suspense } from "react";

import { auth, SignedIn, SignedOut } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { NameInput } from "./_components/name";
import { BingoCard } from "./_components/bingoCard";
import { UserList } from "./_components/userList";

export default async function Home() {
  const session = await auth();
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.user.getUsers.prefetch();

  return (
    <HydrateClient>
      <main>
        <Suspense>
          <SignedIn>
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">
                Hello, {session?.user?.name}
              </p>
            </div>

            <UserList />
            <BingoCard />
          </SignedIn>
          <SignedOut>
            <NameInput />
          </SignedOut>
        </Suspense>
      </main>
    </HydrateClient>
  );
}
