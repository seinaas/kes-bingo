import z from "zod";
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { cards, userStorage } from "~/server/utils/storage";
import { generateCard } from "~/server/utils/generateCard";
import type { BingoCard } from "~/types";

const cardCache = new Map<string, BingoCard>();

const getOrCreateCard = async (userId: string) => {
  let card = cardCache.get(userId) ?? null;

  if (!card) {
    card = await cards.getItem(userId);

    if (!card) {
      card = generateCard();
      await cards.setItem(userId, card);
    }

    cardCache.set(userId, card);
  }

  return card;
};

const checkWin = (card: BingoCard): boolean => {
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (card.every((col) => col[row]?.checked)) {
      return true;
    }
  }
  // Check columns
  for (let col = 0; col < 5; col++) {
    if (card[col]?.every((cell) => cell.checked)) {
      return true;
    }
  }
  // Check diagonals
  if (
    (card[0][0]?.checked &&
      card[1][1]?.checked &&
      card[2][2]?.checked &&
      card[3][3]?.checked &&
      card[4][4]?.checked) ||
    (card[0][4]?.checked &&
      card[1][3]?.checked &&
      card[2][2]?.checked &&
      card[3][1]?.checked &&
      card[4][0]?.checked)
  ) {
    return true;
  }

  return false;
};

export const bingoRouter = createTRPCRouter({
  getCard: authedProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const id = input?.userId ?? ctx.session?.user.id;

      if (!id) throw new Error("Unauthorized");

      const card = await getOrCreateCard(id);

      return card;
    }),
  toggleCell: authedProcedure
    .input(z.object({ colIdx: z.number(), rowIdx: z.number() }))
    .mutation(async ({ input, ctx }) => {
      console.log("Toggling Cell", Date.now());

      const card = await getOrCreateCard(ctx.user.id);

      if (
        input.colIdx < 0 ||
        input.colIdx > 4 ||
        input.rowIdx < 0 ||
        input.rowIdx > 4
      ) {
        throw new Error("Invalid input");
      }

      if (input.colIdx === 2 && input.rowIdx === 2) {
        throw new Error("Can't uncheck free square");
      }

      const cell = card[input.colIdx]![input.rowIdx]!;
      cell.checked = !cell.checked;

      if (checkWin(card)) {
        const user = await userStorage.getItem(ctx.user.id);
        if (user && !user.didWin) {
          user.didWin = true;
          await userStorage.setItem(ctx.user.id, user);
          ctx.ee.emit("win", ctx.user.id);
        }
      }

      ctx.ee.emit("changeCell", ctx.user.id, card);
      await cards.setItem(ctx.user.id, card);

      console.log("Cell Toggled", Date.now());

      return card;
    }),
  onCardChange: publicProcedure
    .input(z.object({ userId: z.string() }).optional())
    .subscription(async function* ({ ctx, signal, input }) {
      const id = input?.userId ?? ctx.session?.user.id;

      if (!id) throw new Error("Unauthorized");

      const iterable = ctx.ee.toIterable("changeCell", {
        signal,
      });

      const card = await getOrCreateCard(id);
      yield card;

      for await (const [userId, newCard] of iterable) {
        if (userId === id) {
          yield newCard;
        }
      }
    }),
  onWin: publicProcedure.subscription(async function* ({ ctx, signal }) {
    const iterable = ctx.ee.toIterable("win", {
      signal,
    });

    for await (const [userId] of iterable) {
      yield userId;
    }
  }),
});
