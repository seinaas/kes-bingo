import { createStorage } from "unstorage";
import type { BingoCard } from "~/types";
import fsDriver from "unstorage/drivers/fs";

export interface BaseUser {
  id: string;
  name: string;
  didWin?: boolean;
}

export const cards = createStorage<BingoCard>({
  driver: fsDriver({ base: "./tmp/cards" }),
});

export const userStorage = createStorage<BaseUser>({
  driver: fsDriver({ base: "./tmp/auth" }),
});
