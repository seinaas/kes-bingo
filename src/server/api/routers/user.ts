import { authedProcedure, createTRPCRouter } from "../trpc";
import { userStorage, type BaseUser } from "~/server/utils/storage";

export const userRouter = createTRPCRouter({
  getUsers: authedProcedure.query(async () => {
    const keys = await userStorage.getKeys();

    const users: BaseUser[] = [];
    for (const key of keys) {
      const user = await userStorage.getItem(key);
      if (user) users.push(user);
    }

    return users;
  }),
});
