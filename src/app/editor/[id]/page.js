import BlogEditor from "@/components/BlogEditor";

export default function Page({ params }) {
  return (
    <main className="text-white">
      <BlogEditor id={params.id} useTLDR={false} />
    </main>
  );
}
