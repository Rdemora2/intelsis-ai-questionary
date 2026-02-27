import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// This page is no longer used in the lead capture flow.
// Redirect visitors back to the home page.
export default function ResultPage() {
  redirect("/");
}
