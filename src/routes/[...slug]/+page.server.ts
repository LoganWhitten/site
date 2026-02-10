import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
	const slug = params.slug ?? "";
	const target = slug ? `https://dev.loganwhitten.com/${slug}` : "https://dev.loganwhitten.com";
	throw redirect(308, target);
};
