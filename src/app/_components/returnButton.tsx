"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export const ReturnButton = () => {
  const { data: session } = useSession();

  if (!session?.user.id) return null;

  return <Link href={`/user/${session.user.id}`}>My Board</Link>;
};
