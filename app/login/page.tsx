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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to CoolWebs
          </h1>
          <p className="text-slate-400">Sign in to upvote and submit websites</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
          <AuthForm />
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}
