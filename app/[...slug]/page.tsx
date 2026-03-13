import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = Array.isArray(slug) ? slug.join('/') : slug;
  redirect(`https://dev.loganwhitten.com/${path}`);
}
