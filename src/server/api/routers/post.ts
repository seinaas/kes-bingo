import { tracked } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Mocked DB
export type Post = {
  id: number;
  name: string;
};
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);

      ctx.ee.emit("add", post);

      return post;
    }),

  onPostAdd: publicProcedure
    .input(
      z
        .object({
          // lastEventId is the last event id that the client has received
          // On the first call, it will be whatever was passed in the initial setup
          // If the client reconnects, it will be the last event id that the client received
          lastEventId: z.string().nullish(),
        })
        .optional(),
    )
    .subscription(async function* (opts) {
      // We start by subscribing to the ee so that we don't miss any new events while fetching
      const iterable = opts.ctx.ee.toIterable("add", {
        // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
        signal: opts.signal,
      });
      if (opts.input?.lastEventId) {
        // [...] get the posts since the last event id and yield them
        // const items = await db.post.findMany({ ... })
        // for (const item of items) {
        //   yield tracked(item.id, item);
        // }
      }
      // listen for new events
      for await (const [post] of iterable) {
        // tracking the post id ensures the client can reconnect at any time and get the latest events this id
        yield tracked(post.id.toString(), post);
      }
    }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),
});
