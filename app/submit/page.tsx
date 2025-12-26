import { SubmitForm } from "@/components/SubmitForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SubmitPage() {
  // Require authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Submit a Website
        </h1>
        <p className="text-slate-400">
          Share an awesome website with the community
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-800">
        <SubmitForm />
      </div>
    </div>
  );
}
