import { redirect } from "next/navigation";

export default async function Page(props: PageProps<"/[...slug]">) {
  const { slug } = await props.params;
  redirect(`https://dev.loganwhitten.com/${slug}`)
}
