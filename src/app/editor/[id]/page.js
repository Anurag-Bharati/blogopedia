import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../config/firebase/firebase";
import BlogEditor from "@/components/BlogEditor";

export default async function Page({ params }) {
  // Fetch necessary data for the blog post using params.id
  const docRef = doc(firestore, "blogs", params.id);
  const documentSnapshot = await getDoc(docRef);
  // handle not found
  if (!documentSnapshot.exists()) return <div>Not found</div>;

  return (
    <main className="text-white">
      <BlogEditor id={params.id} />
    </main>
  );
}
