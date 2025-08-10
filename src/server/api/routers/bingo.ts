import { createTRPCRouter, publicProcedure } from "../trpc";

type Column = [string, string, string, string, string];

export type Board = {
  b: Column;
  i: Column;
  n: Column;
  g: Column;
  o: Column;
};

export const bingoRouter = createTRPCRouter({
  getBoard: publicProcedure.query(() => {
    return false;
  }),
});
