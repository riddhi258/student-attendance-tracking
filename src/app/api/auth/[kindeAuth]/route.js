import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth({
  kindeIssuerUrl: process.env.KINDE_ISSUER_URL, // Safe to keep this explicit if needed
});
