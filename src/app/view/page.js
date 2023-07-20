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

// returns the metadata for the page
export async function generateMetadata({ searchParams }) {
  const { props } = await fetchBlog({ params: searchParams });
  return {
    title: `${props.blog.title} by ${props.blog.author.name}`,
    description: props.blog.description,
    image: props.blog.image,
    publisher: "Blogopedia",
    authors: [{ name: props.blog.author.name }],
    keywords: props.blog.tags,
    creator: props.blog.author.name,
    referrer: "origin-when-cross-origin",
    language: "en",
    category: "blog",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    twitter: {
      title: `${props.blog.title} by ${props.blog.author.name}`,
      description: props.blog.description,
      images: [{ url: props.blog.image, alt: props.blog.title }],
      card: "summary_large_image",
      // creator: props.blog.author.twitter.handle, // for twitter handle if any
      // creatorID: props.blog.author.twitter.id, // for twitter id if any
      siteId: props.id,
    },
    openGraph: {
      title: `${props.blog.title} by ${props.blog.author.name}`,
      description: props.blog.tldr ?? props.blog.title,
      images: [
        {
          url: props.blog.cover,
          alt: props.blog.title,
        },
      ],
      publishedTime: props.blog.createdAt.toDate().toISOString(),
      modifiedTime: props.blog.updatedAt.toDate().toISOString(),
      url: `https://blogopedia.vercel.app/view?id=${props.id}`,
      siteName: "Blogopedia",
      locale: "en_US",
      type: "website",
      authors: [props.blog.author.name],
    },
    alternates: {
      canonical: `https://blogopedia.vercel.app/view?id=${props.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    icons: {
      icon: "/icon.png",
    },
    generator: "Blogopedia",
    applicationName: "Blogopedia",
  };
}

export default async function Page({ searchParams }) {
  if (!searchParams.id) return notFound();
  const { props } = await fetchBlog({ params: searchParams });
  return (
    <main>
      <ReadingView id={props.id} blog={{ ...props.blog, updatedAt: props.blog.updatedAt.seconds, createdAt: props.blog.createdAt.seconds }} />
    </main>
  );
}
