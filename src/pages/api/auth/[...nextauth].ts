// Imports
// ========================================================
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

// Auth
// ========================================================
const Auth = (req: NextApiRequest, res: NextApiResponse) => {
  const authOpts = authOptions({ req });

  const isDefaultSigninPage =
    req.method === "GET" && req?.query?.nextauth?.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    // Removes from the authOptions.providers array
    authOpts.providers.pop();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return NextAuth(req, res, authOpts);
};

// Exports
// ========================================================
export default Auth;
