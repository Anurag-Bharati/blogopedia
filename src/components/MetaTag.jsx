import Head from "next/head";

const MetaTags = ({ title, description, image }) => {
  console.log("title", title);
  console.log("description", description);
  console.log("image", image);

  return (
    <Head>
      <title>{title}</title>
      <meta property="description" content={description} />
      <meta property="image" content={image} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:type" content="website" />
      <meta name="og:site_name" content="Blogopedia" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default MetaTags;
