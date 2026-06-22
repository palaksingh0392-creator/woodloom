import AdminBlogManager from "@/features/admin/components/admin-blog-manager";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { listAdminBlogPosts } from "@/lib/blogs";

export default async function AdminBlogsPage() {
  const posts = await listAdminBlogPosts();

  return (
    <AdminSectionCard title="Blog Management">
      <AdminBlogManager
        posts={posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          author: post.author,
          isPublished: post.isPublished,
          publishedAt: post.publishedAt?.toISOString() ?? null,
          updatedAt: post.updatedAt.toISOString(),
        }))}
      />
    </AdminSectionCard>
  );
}
