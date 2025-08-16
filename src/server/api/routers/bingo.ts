import z from "zod";
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { cards } from "~/server/utils/storage";
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
});
