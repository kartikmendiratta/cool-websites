import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Auth0 client - automatically reads from environment variables
// Supports both Google OAuth and Email/Password authentication
export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
    // No connection specified = shows Auth0 Universal Login with all enabled methods
  },
});
