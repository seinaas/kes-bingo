import EventEmitter, { on } from "events";
import type { Post } from "../api/routers/post";

type EventMap<T> = Record<keyof T, unknown[]>;
export class IterableEventEmitter<
  T extends EventMap<T>,
> extends EventEmitter<T> {
  toIterable<TEventName extends keyof T & string>(
    eventName: TEventName,
    opts?: NonNullable<Parameters<typeof on>[2]>,
  ): AsyncIterable<T[TEventName]> {
    return on(this as unknown as EventTarget, eventName, opts) as AsyncIterable<
      T[TEventName]
    >;
  }
}

export type Events = {
  add: [Post];
};
