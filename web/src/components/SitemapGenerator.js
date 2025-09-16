import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

const SitemapGenerator = () => {
  const { posts } = useAppSelector((state) => state.posts);

  useEffect(() => {
    // Generate sitemap when posts are loaded
    if (posts && posts.length > 0) {
      generateSitemap();
    }
  }, [posts]);

  const generateSitemap = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
    const currentDate = new Date().toISOString();

    const staticPages = [
      {
        url: `${baseUrl}/`,
        lastmod: currentDate,
        changefreq: "daily",
        priority: "1.0",
      },
      {
        url: `${baseUrl}/search`,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "0.8",
      },
    ];

    const blogPages = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastmod: new Date(post.updatedAt || post.createdAt).toISOString(),
      changefreq: "weekly",
      priority: "0.9",
    }));

    const allPages = [...staticPages, ...blogPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    // Create a blob and download it
    const blob = new Blob([sitemap], { type: "application/xml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return null; // This component doesn't render anything
};

export default SitemapGenerator;
