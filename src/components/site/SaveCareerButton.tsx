import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { readBookmarks } from "@/lib/planning";
import { buttonVariants } from "@/components/ui/button";
export function SaveCareerButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => setSaved(readBookmarks().includes(slug));
    refresh();
    window.addEventListener("careercompass-bookmarks", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("careercompass-bookmarks", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [slug]);
  return (
    <div>
      <button
        className={buttonVariants({ variant: saved ? "secondary" : "outline" })}
        aria-pressed={saved}
        onClick={() => {
          try {
            const list = readBookmarks();
            const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
            localStorage.setItem("careercompass_saved", JSON.stringify(next));
            window.dispatchEvent(new Event("careercompass-bookmarks"));
            setSaved(next.includes(slug));
            setError("");
          } catch {
            setError("Unable to save in this browser.");
          }
        }}
      >
        <Bookmark className="mr-2 size-4" />
        {saved ? "Saved — remove" : "Save career"}
      </button>
      <span aria-live="polite" className="text-sm">
        {error}
      </span>
    </div>
  );
}
