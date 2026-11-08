import { redirect } from "next/navigation";

export default async function VerifyRootRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id, token } = await searchParams;
  const qId = encodeURIComponent(id || "");
  const qToken = encodeURIComponent(token || "");

  redirect(`/en/verify/credential?id=${qId}&token=${qToken}`);
}
