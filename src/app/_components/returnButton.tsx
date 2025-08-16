"use client";

import { Home } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const ReturnButton = () => {
  const { data: session } = useSession();

  if (!session?.user.id) return null;

  return (
    <Link
      href={`/user/${session.user.id}`}
      className="bg-accent-500 flex items-center justify-center gap-4 rounded-lg px-8 py-4 text-lg font-bold uppercase shadow-xl"
    >
      <Home size={20} strokeWidth={3} />
      My Card
    </Link>
  );
};
