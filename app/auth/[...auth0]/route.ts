import { auth0 } from "@/lib/auth0";
import { NextRequest } from "next/server";

// This route handles all Auth0 authentication flows
// Supports: /auth/login, /auth/logout, /auth/callback, /auth/profile, /auth/access-token
export async function GET(request: NextRequest) {
  return auth0.middleware(request);
}

export async function POST(request: NextRequest) {
  return auth0.middleware(request);
}
