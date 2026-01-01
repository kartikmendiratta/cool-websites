import { SubmitForm } from "@/components/SubmitForm";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SubmitPage() {
  // Require authentication via Auth0
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-retro-dark font-bold hover:text-retro-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to home
      </Link>

      <div className="mb-8">
        <h1 className="text-5xl font-black mb-3 text-retro-dark">
          Submit a <span className="text-retro-accent">Website</span> 🚀
        </h1>
        <p className="text-gray-600 font-mono">
          Share an awesome website with the community
        </p>
      </div>

      <div className="card-retro">
        <SubmitForm />
      </div>
    </div>
  );
}
