"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Globe, Type, FileText, Loader2, CheckCircle2 } from "lucide-react";

export function SubmitForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tools");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate URL
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(url)) {
        throw new Error("Please enter a valid URL starting with http:// or https://");
      }

      // Insert website
      const { error: insertError } = await supabase.from("websites").insert({
        title,
        url,
        description,
        category,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTitle("");
      setUrl("");
      setDescription("");
      setCategory("tools");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to submit website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-16 h-16 text-retro-mint mx-auto mb-4" />
        <h3 className="text-2xl font-black text-retro-dark mb-2">Submitted for review! 🎉</h3>
        <p className="text-gray-600 font-mono">We'll publish it after approval.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-retro-accent/10 border-2 border-retro-accent rounded-md text-retro-accent text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-retro-dark mb-2">
          Website Title
        </label>
        <div className="relative">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., GitHub"
            maxLength={100}
            className="input-retro pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-retro-dark mb-2">
          Website URL
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input-retro pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-retro-dark mb-2">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What makes this website awesome?"
            rows={4}
            maxLength={500}
            className="input-retro pl-10 resize-none"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 font-mono">
          {description.length}/500 characters
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-bold text-retro-dark mb-2"
         >
          Category
        </label>
        <select
          id ="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-retro cursor-pointer"
        >
          <option value="tools">🛠️ Tools</option>
          <option value="education">📚 Education</option>
          <option value="fun">🎮 Fun</option>
          <option value="design">🎨 Design</option>
          <option value="productivity">⚡ Productivity</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-retro-accent text-white font-bold py-3 px-4 rounded-md border-2 border-retro-dark shadow-retro hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-retro"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        Submit Website
      </button>
    </form>
  );
}
