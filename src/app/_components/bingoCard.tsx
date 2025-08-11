"use client";

import { cn } from "~/server/utils/cn";
import { api } from "~/trpc/react";

export const BingoCard = ({ userId }: { userId?: string }) => {
  const { data: bingoCard } = api.bingo.onCardChange.useSubscription(
    userId ? { userId } : undefined,
  );

  const toggleCell = api.bingo.toggleCell.useMutation();

  // TODO: Use subscription to get bingo card for user ID

  return (
    <div className="grid grid-cols-5 grid-rows-5">
      {bingoCard?.map((col, colIdx) =>
        col.map((cell, rowIdx) => {
          return (
            <div
              className={cn(
                "flex aspect-square items-center justify-center bg-white p-4 text-black",
                cell.checked && "bg-red-400",
              )}
              key={`card-${userId}-${colIdx}-${rowIdx}`}
              onClick={() => toggleCell.mutate({ colIdx, rowIdx })}
            >
              {cell.text}
            </div>
          );
        }),
      )}
    </div>
  );
};
