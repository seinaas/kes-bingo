import z from "zod";
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { userStorage, type BaseUser } from "~/server/utils/storage";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => {
    const keys = await userStorage.getKeys();

    const users: BaseUser[] = [];
    for (const key of keys) {
      const user = await userStorage.getItem(key);
      if (user) users.push(user);
    }

    return users;
  }),
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await userStorage.getItem(input.userId);

      if (!user) {
        throw new Error("User Not Found");
      }

      return user;
    }),
});
