import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Blog Platform - Share Your Thoughts",
  description = "A modern blog platform where you can share your thoughts, ideas, and stories with the world. Create, read, and engage with amazing content.",
  keywords = "blog, writing, content, stories, articles, thoughts, ideas",
  image = "/logo192.png",
  url = "",
  type = "website",
  author = "Blog Platform",
  publishedTime = null,
  modifiedTime = null,
  structuredData = null,
}) => {
  const fullTitle = title.includes("Blog Platform") ? title : `${title} | Blog Platform`;
  const fullUrl = url ? `${process.env.REACT_APP_BASE_URL || "http://localhost:3000"}${url}` : process.env.REACT_APP_BASE_URL || "http://localhost:3000";
  const fullImage = image.startsWith("http") ? image : `${process.env.REACT_APP_BASE_URL || "http://localhost:3000"}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Blog Platform" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
};

export default SEO;
