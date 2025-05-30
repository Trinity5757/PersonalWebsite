// app/api/auth/route.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { User } from "@/app/models/Users";
import { authConfig } from "./auth.config";
import { connectDB } from "@/app/lib/connectDB";
import "next-auth";
import { ExtendedJWT } from "next-auth/jwt";

// Extend the default NextAuthOptions interface
declare module "next-auth" {
  interface User {
    role: "user" | "admin";
    gender: "male" | "female" | "other";
    jwt: string;
    username: string;
    avatar_image?: string;
  }

  interface Session {
    user?: User;
    id?: string;
    email?: string;
    role?: "user" | "admin";
    jwt?: string;
    username?: string;
    avatar_image?: string;
  }
}

declare module "@auth/core/jwt" {
  interface ExtendedJWT extends JWT {
    id: string;
    email: string;
    role: "user" | "admin";
    gender: "male" | "female" | "other";
    username: string;
    jwt: string;
    avatar_image?: string;
  }
}

async function getUser(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

async function updateLastLogin(email: string) {
  try {
    await connectDB();
    await User.updateOne(
      { email },
      { $set: { last_login: new Date() } }
    ).exec();
  } catch (error) {
    console.error("Failed to update last login:", error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid input. Please check your credentials.");
        }

        const { email, password } = parsedCredentials.data;

        const user = await getUser(email);
        if (user && (await bcryptjs.compare(password, user.password))) {
          await updateLastLogin(email);
          return {
            id: user._id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            role: user.role,
            avatar_image: user.avatar_image,
          }; // Return only necessary fields
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user && user.id && user.email) {
        token.user = user;
        token.username = user.username;
        token.id = user.id;
        token.jwt = user.jwt;
        token.email = user.email;
        token.role = user.role;
        token.gender = user.gender;
        token.avatar_image = user.avatar_image;
      }
      if (trigger === "update" && session?.user) {
        return {
          ...token,
          user: {
            ...(token.user || {}),
            ...session.user,
          },
        };
      }
      return token;
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedJWT;
      if (extendedToken.user) {
        session.user = {
          ...session.user,
          ...extendedToken.user,
        };
      }
      return session;
    },
  },
});
