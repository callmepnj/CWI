import { redirect } from "next/navigation";

export default function LegacyTagRedirectPage() {
  redirect("/archive");
}
