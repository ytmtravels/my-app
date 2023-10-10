import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null;
          }
          console.log("email user: ", user);
          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SCRECT,
      profile: async (profile) => {
        const name = profile.name;
        const email = profile.email;
        const image = profile.picture;
        const provider = "google";
        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email });
          if (!userExists) {
            const res = await fetch("http://localhost:3000/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
                image,
                provider,
              }),
            });
            if (res.ok) {
              const newUser = await User.findOne({ email });
              console.log("New USer: ", newUser);
              return newUser;
            }
          } else {
            console.log("Old USer: ", userExists);
            return userExists;
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    session: {
      strategy: "jwt",
    },
    async jwt({ token, user, session }) {
      console.log("jwt callback: ", { token, user, session });
      if (user) {
        return {
          ...token,
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.picture,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("session callback: ", { session, token, user });
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
          },
        };
      }
      return session;
    },
    // async signIn({ user, account }) {
    //   const provider = account.provider;
    //   console.log("server provider: ", account.provider);
    //   if (account.provider === "google") {
    //     const { name, email, image } = user;
    //     try {
    //       await connectMongoDB();
    //       const userExists = await User.findOne({ email });
    //       if (!userExists) {
    //         await fetch("http://localhost:3000/api/user", {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({
    //             name,
    //             email,
    //             image,
    //             provider,
    //           }),
    //         });
    //       }
    //       return user;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //   return user;
    // },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
