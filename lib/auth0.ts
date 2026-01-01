import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Auth0 client - automatically reads from environment variables
export const auth0 = new Auth0Client({
  authorizationParameters: {
    connection: "google-oauth2", // Force Google sign-in
    scope: "openid profile email",
  },
});
