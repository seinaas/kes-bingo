import type { Session } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cache } from "react";
import { createStorage } from "unstorage";
import { z } from "zod";
import { UnstorageAdapter } from "@auth/unstorage-adapter";
import { randomUUID } from "crypto";

const storage = createStorage();
export const {
  handlers,
  auth: uncachedAuth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      id: "uuid",
      name: "UUID Auth",
      async authorize(input) {
        console.log("HEREHEREHERE", input);
        const credentials = z
          .union([
            z.object({
              id: z.string(),
            }),
            z.object({
              name: z.string(),
            }),
          ])
          .parse(input);

        if ("id" in credentials) {
          // Get user with credentials.id and return
          const user = null;

          if (!user) {
            throw new Error("Invalid ID");
          }

          return user;
        }
        const userId = randomUUID();

        return {
          id: userId,
          name: credentials.name,
        };
      },
      credentials: {
        id: {},
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: UnstorageAdapter(storage),
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: ({ session, token }) => {
      if (typeof token.id === "string") session.user.id = token.id!;
      return session;
    },
    signIn: async () => {
      const currentUser = (await auth())?.user;

      if (currentUser) {
        throw new Error("Already signed in");
      }

      return true;
    },
  },
  trustHost: true,
});

export const auth = cache(uncachedAuth);

export async function SignedIn(props: {
  children:
    | React.ReactNode
    | ((props: { user: Session["user"] }) => React.ReactNode);
}) {
  const sesh = await auth();
  return sesh?.user ? (
    <>
      {typeof props.children === "function"
        ? props.children({ user: sesh.user })
        : props.children}
    </>
  ) : null;
}

export async function SignedOut(props: { children: React.ReactNode }) {
  const sesh = await auth();
  return sesh?.user ? null : <>{props.children}</>;
}
