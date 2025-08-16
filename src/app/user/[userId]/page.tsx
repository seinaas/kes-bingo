import { BingoCard } from "~/app/_components/bingoCard";
import { UserList } from "~/app/_components/userList";
import { HydrateClient } from "~/trpc/server";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  try {
    return (
      <HydrateClient>
        <div className="container flex flex-col items-center gap-6 px-2 py-16">
          <div className="font-title stroke-3 text-6xl">Kes Bingo</div>
          <UserList currentUserId={userId} />
          <BingoCard userId={userId} />
        </div>
      </HydrateClient>
    );
  } catch (e) {
    console.error(e);
  }
}
