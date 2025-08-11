import { createStorage } from "unstorage";
import type { BingoCard } from "~/types";
import fsDriver from "unstorage/drivers/fs";

export const cards = createStorage<BingoCard>({
  driver: fsDriver({ base: "./tmp" }),
});
