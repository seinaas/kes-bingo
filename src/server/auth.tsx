import type { NextAuthConfig, Session, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cache } from "react";
import { z } from "zod";
import { randomUUID } from "crypto";
import type { BingoCard } from "~/types";
import { generateCard } from "./utils/generateCard";
import { userStorage, cards, type BaseUser } from "./utils/storage";

declare module "next-auth" {
  export interface User extends BaseUser {
    card?: BingoCard | null;
  }

  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    error?: string;
  }
}

const createUserSchema = z.object({
  name: z.string(),
});

const credentialsSchema = z.union([
  z.object({
    id: z.string(),
  }),
  createUserSchema,
]);
type CreateUserInput = z.infer<typeof createUserSchema>;

const createUser = async ({ name }: CreateUserInput): Promise<User> => {
  const userId = randomUUID();
  const card = generateCard();

  const user: BaseUser = {
    id: userId,
    name: name,
    didWin: false,
  };

  await userStorage.setItem(userId, user);
  await cards.setItem(userId, card);

  return { ...user, card };
};

export const authConfig = {
  providers: [
    CredentialsProvider({
      id: "uuid",
      name: "UUID Auth",
      async authorize(input) {
        const credentials = credentialsSchema.parse(input);

        if ("id" in credentials) {
          // Get user with credentials.id and return
          const user = await userStorage.getItem(credentials.id);

          if (!user) {
            throw new Error("Invalid ID");
          }

          return user;
        }

        const user = await createUser(credentials);

        return user;
      },
      credentials: {
        id: {},
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (typeof token.id === "string") session.user.id = token.id!;

      const user = await userStorage.getItem(session.user.id);
      if (!user) {
        session.error = "inactive-user";
      }

      const card = await cards.getItem(session.user.id);
      const sessionUser = {
        ...user,
        card,
      };

      return { ...session, user: sessionUser };
    },
    signIn: async () => {
      const currentUser = (await auth())?.user;

      if (currentUser) {
        throw new Error("Already signed in");
      }

      return true;
    },
  },
} as const satisfies NextAuthConfig;

export const {
  handlers,
  auth: uncachedAuth,
  signIn,
  signOut,
} = NextAuth(authConfig);

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
