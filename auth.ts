import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("No user found with the given email");
        }

        if (
          !bcrypt.compareSync(credentials.password as string, user.password)
        ) {
          throw new Error("Invalid password");
        }

        return { id: user.id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
});
