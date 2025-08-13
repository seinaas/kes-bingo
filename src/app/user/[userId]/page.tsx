import { BingoCard } from "~/app/_components/bingoCard";
import { UserList } from "~/app/_components/userList";
import { HydrateClient } from "~/trpc/server";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <HydrateClient>
      <div>My ID: {userId}</div>
      <UserList />
      <BingoCard userId={userId} />
    </HydrateClient>
  );
}
