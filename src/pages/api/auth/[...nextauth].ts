import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";

function isValidEmailDomain(email: string): boolean {
  return email.endsWith("@reedu.de");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.type === "email" && user?.email) {
          if (!isValidEmailDomain(user.email)) {
            return "/auth/error?error=InvalidDomain";
          }
        } else {
          return "/auth/error?error=InvalidEmail";
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          return "/auth/error?error=UserNotFound";
        }

        // Hier können Sie in Zukunft weitere Überprüfungen hinzufügen,
        // wenn Sie eine Möglichkeit finden, Benutzer zu blockieren

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return "/auth/error?error=ServerError";
      }
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      try {
        const prismaUser = await prisma.user.findUnique({
          where: {
            email: token.email ?? undefined,
          },
        });

        if (prismaUser) {
          return {
            id: prismaUser.id,
            name: prismaUser.name,
            email: prismaUser.email,
            picture: prismaUser.image,
            role: prismaUser.role,
          };
        }
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },
  },
};

export default NextAuth(authOptions);

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     EmailProvider({
//       server: {
//         host: process.env.EMAIL_SERVER_HOST,
//         port: Number(process.env.EMAIL_SERVER_PORT),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER,
//           pass: process.env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Überprüfen, ob die credentials nicht undefined sind
//         if (!credentials) {
//           throw new Error("Credentials not provided");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (user && bcrypt.compareSync(credentials.password, user.password)) {
//           return {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             image: user.image,
//             role: user.role,
//           };
//         }

//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ token, session }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.picture;
//         session.user.role = token.role;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//       }

//       const prismaUser = await prisma.user.findFirst({
//         where: {
//           email: token.email,
//         },
//       });

//       if (prismaUser) {
//         return {
//           id: prismaUser.id,
//           name: prismaUser.name,
//           email: prismaUser.email,
//           picture: prismaUser.image,
//           role: prismaUser.role,
//         };
//       }

//       return token;
//     },
//   },
// };

// export default NextAuth(authOptions);
