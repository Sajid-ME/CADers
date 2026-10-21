import { redirect } from "next/navigation";

export default function AdminEnrollmentsPage() {
  redirect("/admin/students?tab=courses");
}
