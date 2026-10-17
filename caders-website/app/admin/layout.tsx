import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminTabs from "./AdminTabs";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/enrollments", label: "Enrollments" },
  { href: "/admin/materials", label: "Materials" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/voices", label: "Voices" },
  { href: "/admin/logs", label: "Login Logs" },
];

export const metadata = {
  title: "Admin | CADers",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, username")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    (profile.role !== "admin" && profile.role !== "super_admin")
  ) {
    redirect("/dashboard");
  }

  return (
    <>
      {/* Only the tabs remain right below the Global Navbar */}
      <AdminTabs items={nav} />
      <div className="container py-10">{children}</div>
    </>
  );
}