import { AuthForm } from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 text-retro-dark">
            Welcome to <span className="text-retro-accent">CoolWebs</span> 👋
          </h1>
          <p className="text-gray-600 font-mono">Sign in to upvote and submit websites</p>
        </div>

        <div className="card-retro">
          <AuthForm />
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 font-mono">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}
