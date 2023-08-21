import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type Session,
} from "next-auth";
import { prisma } from "~/server/db";
// SIWE Integration
import type { CtxOrReq } from "next-auth/client/_utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage, type SiweResponse } from "siwe";
import { getCsrfToken } from "next-auth/react";
import { env } from "~/env.mjs";
import { AlchemyProvider } from "@ethersproject/providers";
import { optimismGoerli } from "wagmi/chains";
// Types
// ========================================================
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

// Auth Options
// ========================================================
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: (ctxReq: CtxOrReq) => NextAuthOptions = ({
  req,
}) => ({
  callbacks: {
    // token.sub will refer to the id of the wallet address
    session: ({ session, token }) =>
      ({
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      } as Session & { user: { id: string } }),
    // OTHER CALLBACKS to take advantage of but not needed
    // signIn: async (params: { // Used to control if a user is allowed to sign in
    //   user: User | AdapterUser
    //   account: Account | null
    //   // Not used for credentials
    //   profile?: Profile
    //   // Not user
    //   email?: {
    //     verificationRequest?: boolean
    //   }
    //   /** If Credentials provider is used, it contains the user credentials */
    //   credentials?: Record<string, CredentialInput>
    // }) => { return true; },
    // redirect: async (params: { // Used for a callback url but not used with credentials
    //   /** URL provided as callback URL by the client */
    //   url: string
    //   /** Default base URL of site (can be used as fallback) */
    //   baseUrl: string
    // }) => {
    //    return params.baseUrl;
    // },
    // jwt: async ( // Callback whenever JWT created (i.e. at sign in)
    //   params: {
    //     token: JWT
    //     user: User | AdapterUser
    //     account: Account | null
    //     profile?: Profile
    //     trigger?: "signIn" | "signUp" | "update"
    //     /** @deprecated use `trigger === "signUp"` instead */
    //     isNewUser?: boolean
    //     session?: any
    //   }
    // ) => {
    //   return params.token;
    // }
  },
  // OTHER OPTIONS (not needed)
  // secret: process.env.NEXTAUTH_SECRET, // in case you want pass this along for other functionality
  // adapter: PrismaAdapter(prisma), // Not meant for type 'credentials' (used for db sessions)
  // jwt: { // Custom functionlaity for jwt encoding/decoding
  //   encode: async ({ token, secret, maxAge }: JWTEncodeParams) => {
  //     return encode({
  //       token,
  //       secret,
  //       maxAge,
  //     })
  //   },
  //   decode: async ({ token, secret }: JWTDecodeParams) => {
  //     return decode({ token, secret })
  //   }
  // },
  // session: { // Credentials defaults to this strategy
  //   strategy: 'jwt',
  //   maxAge: 2592000,
  //   updateAge: 86400,
  //   generateSessionToken: () => 'SomeValue'
  // },
  // events: { // Callback events
  //   signIn: async (message: {
  //     user: User
  //     account: Account | null
  //     profile?: Profile
  //     isNewUser?: boolean
  //   }) => {},
  //   signOut: async (message: { session: Session; token: JWT }) => {},
  //   createUser:  async (message: { user: User }) => {},
  //   updateUser:  async (message: { user: User }) => {},
  //   linkAccount: async (message: {
  //     user: User | AdapterUser
  //     account: Account
  //     profile: User | AdapterUser
  //   }) => {},
  //   session: async (message: { session: Session; token: JWT }) => {}
  // },
  providers: [
    CredentialsProvider({
      // ! Don't add this
      // - it will assume more than one auth provider
      // - and redirect to a sign-in page meant for oauth
      // - id: 'siwe',
      name: "Ethereum",
      type: "credentials", // default for Credentials
      // Default values if it was a form
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },

      authorize: async (credentials) => {
        try {
          const siwe = new SiweMessage(
            JSON.parse(
              (credentials?.message as string) ?? "{}"
            ) as Partial<SiweMessage>
          );
          const nextAuthUrl = env.NEXTAUTH_URL;
          const nodeProvider = new AlchemyProvider(
            optimismGoerli.id,
            env.NEXT_PUBLIC_ALCHEMY_ID
          );

          if (!nextAuthUrl) {
            return null;
          }
          const nextAuthHost = new URL(nextAuthUrl).host;
          console.log("nextAuthHost: ", nextAuthHost);
          if (siwe.domain !== nextAuthHost) {
            console.log("siwe.domain !== nextAuthHost");
            return null;
          }
          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          const result: SiweResponse = await siwe.verify(
            {
              signature: credentials?.signature || "",
            },
            {
              provider: nodeProvider,
            }
          );

          if (result.success) {
            // Check if user exists
            let user = await prisma.user.findUnique({
              where: {
                address: result.data.address,
              },
            });
            // Create new user if doesn't exist
            if (!user) {
              user = await prisma.user.create({
                data: {
                  address: result.data.address,
                },
              });
              // create account
              await prisma.account.create({
                data: {
                  userId: user.id,
                  type: "credentials",
                  provider: "Ethereum",
                  providerAccountId: result.data.address,
                },
              });
            }
            // console.log("result: ", result);
            return {
              // Pass user id instead of address
              // id: fields.address
              id: user.id,
            };
          }
          return null;
        } catch (error) {
          // Uncomment or add logging if needed
          console.error({ error });
          return null;
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

// Auth Session
// ========================================================
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // Changed from authOptions to authOption(ctx)
  // This allows use to retrieve the csrf token to verify as the nonce
  return getServerSession(ctx.req, ctx.res, authOptions(ctx));
};

// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { type GetServerSidePropsContext } from "next";
// import {
//   getServerSession,
//   type NextAuthOptions,
//   type ISODateString,
// } from "next-auth";
// import { prisma } from "@/server/db";
// import Credentials from "next-auth/providers/credentials";
// import { SiweMessage, type SiweResponse } from "siwe";
// import { getCsrfToken } from "next-auth/react";
// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       address: string;
//       // ...other properties
//       // role: UserRole;
//     };
//     expires: ISODateString;
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authOptions: NextAuthOptions = {
//   session: { strategy: "jwt" },
//   callbacks: {
//     session({ session, token }) {
//       if (session.user && token.sub) {
//         session.user.id = token.sub;
//         session.user.address = token.sub;
//       }
//       return session;
//     },
//   },
//   adapter: PrismaAdapter(prisma),
//   providers: [],
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
// export const getServerAuthSession = (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   // console.log(ctx.req);
//   return getServerSession(ctx.req, ctx.res, {
//     ...authOptions,
//     providers: [
//       Credentials({
//         name: "Ethereum",
//         credentials: {
//           message: {
//             label: "Message",
//             type: "text",
//             placeholder: "0x0",
//           },
//           signature: {
//             label: "Signature",
//             type: "text",
//             placeholder: "0x0",
//           },
//         },
//         async authorize(credentials) {
//           try {
//             const siwe: SiweMessage = new SiweMessage(
//               JSON.parse(credentials?.message || "{}") as string
//             );

//             const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");

//             const result: SiweResponse = await siwe.verify({
//               signature: credentials?.signature || "",
//               domain: nextAuthUrl.host,
//               nonce: await getCsrfToken({ req: ctx.req }),
//             });

//             if (result.success) {
//               console.log("result:", result);
//               return {
//                 id: siwe.address,
//               };
//             } else {
//               console.log("No success:", result);
//             }
//             return null;
//           } catch (e) {
//             console.log(e);
//             return null;
//           }
//         },
//       }),
//     ],
//   });
// };
