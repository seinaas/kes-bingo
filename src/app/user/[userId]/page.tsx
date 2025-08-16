import { BingoCard } from "~/app/_components/bingoCard";
import { ReturnButton } from "~/app/_components/returnButton";
import { UserList } from "~/app/_components/userList";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth();
  const { userId } = await params;

  try {
    return (
      <HydrateClient>
        <div className="container flex flex-col items-center gap-6 px-2 py-16">
          <div>KES BINGO</div>
          <UserList currentUserId={userId} />
          <BingoCard userId={userId} />
          {userId !== session?.user.id && <ReturnButton />}
        </div>
      </HydrateClient>
    );
  } catch (e) {
    console.error(e);
  }
}
