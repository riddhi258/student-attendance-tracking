import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth({
    kindeIssuerUrl: process.env.KINDE_ISSUER_URL, // Explicitly pass the variable
}); 