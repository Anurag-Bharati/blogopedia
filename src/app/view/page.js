import ReadingView from "@/components/ReadingView";
import { firestore } from "@/config/firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { notFound } from "next/navigation";

async function fetchBlog({ params }) {
  const d = await getDoc(doc(firestore, "blogs", params.id));
  if (!d.exists()) return notFound();

  // TODO USE SSS
  // const session = await getServerSession();
  // Can SS TTS Text generation here

  return { props: { blog: d.data(), id: d.id } };
}

export default async function Page({ searchParams }) {
  if (!searchParams.id) return notFound();
  const { props } = await fetchBlog({ params: searchParams });
  return (
    <div>
      <ReadingView id={props.id} blog={{ ...props.blog, updatedAt: props.blog.updatedAt.seconds, createdAt: props.blog.createdAt.seconds }} />
    </div>
  );
}
