import BlogEditor from "@/components/BlogEditor";
import { notFound } from "next/navigation";

export default function Page({ params }) {
  if (!params) return notFound();
  return (
    <main className="text-white">
      <BlogEditor id={params.id} />
    </main>
  );
}
