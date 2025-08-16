import z from "zod";
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { cards, userStorage, type BaseUser } from "~/server/utils/storage";

const getUsers = async () => {
  const keys = await userStorage.getKeys();

  const users: BaseUser[] = [];
  for (const key of keys) {
    const user = await userStorage.getItem(key);
    if (user) users.push(user);
  }

  return users;
};

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => {
    const users = await getUsers();

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
  removeUser: authedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .mutation(async ({ input, ctx }) => {
      if (
        input?.userId &&
        input.userId !== ctx.user.id &&
        ctx.user.name !== "Seina"
      ) {
        throw new Error("You are not allowed to remove users");
      }

      const id = input?.userId ?? ctx.user.id;

      const user = await userStorage.getItem(id);
      if (!user) {
        throw new Error("User Not Found");
      }

      await userStorage.removeItem(id);
      await cards.removeItem(id);

      ctx.ee.emit("changeUsers");
    }),
  updateUser: authedProcedure
    .input(
      z.object({
        imageUrl: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const newUser = {
        ...ctx.user,
        ...input,
      };

      await userStorage.setItem(ctx.user.id, newUser);

      ctx.ee.emit("changeUsers");
    }),
  onUsersChange: publicProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    const iterable = ctx.ee.toIterable("changeUsers", {
      signal,
    });

    ctx.ee.emit("changeUsers");

    for await (const [] of iterable) {
      const users = await getUsers();
      yield users;
    }
  }),
});
