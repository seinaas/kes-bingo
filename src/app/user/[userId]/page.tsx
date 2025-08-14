import { BingoCard } from "~/app/_components/bingoCard";
import { ReturnButton } from "~/app/_components/returnButton";
import { UserList } from "~/app/_components/userList";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();
  const { userId } = await params;

  try {
    const user = await api.user.getUser({ userId });

    return (
      <HydrateClient>
        <div>Viewing {user.name}&apos;s board.</div>
        <UserList />
        <BingoCard userId={userId} />
        {userId !== session?.user.id && <ReturnButton />}
      </HydrateClient>
    );
  } catch (e) {
    console.error(e);
  }
}
