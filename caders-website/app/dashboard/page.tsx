import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import LogoutButton from "@/components/LogoutButton";
import { FileText, ClipboardList, BookOpen, Download } from "lucide-react";

export const metadata = {
  title: "Dashboard | CADers",
};

type MaterialRow = {
  id: string;
  course_id: string;
  type: "slide" | "hw" | "cw";
  title: string;
  file_path: string;
  uploaded_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, username, department, roll_number")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  if (profile.role === "admin" || profile.role === "super_admin") {
    redirect("/admin");
  }

  // Enrollments (with course info)
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      "id, enrolled_at, courses:course_id (id, name, description, order_index)"
    )
    .eq("student_id", user.id);

  // Materials for enrolled courses (RLS filters them)
  const { data: materials } = await supabase
    .from("materials")
    .select("id, course_id, type, title, file_path, uploaded_at")
    .order("uploaded_at", { ascending: false });

  // Generate signed URLs (1 hour)
  const materialsWithUrls: (MaterialRow & { url: string | null })[] = [];
  for (const m of (materials ?? []) as MaterialRow[]) {
    const { data: signed } = await supabase.storage
      .from("materials")
      .createSignedUrl(m.file_path, 3600);
    materialsWithUrls.push({ ...m, url: signed?.signedUrl ?? null });
  }

  const grouped = new Map<string, typeof materialsWithUrls>();
  for (const m of materialsWithUrls) {
    if (!grouped.has(m.course_id)) grouped.set(m.course_id, []);
    grouped.get(m.course_id)!.push(m);
  }

  const courses = (enrollments ?? [])
    .map((e: any) => e.courses)
    .filter(Boolean)
    .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));

  return (
    <>
      <div className="border-b border-outline-variant bg-surface-container">
        <div className="container flex items-center justify-between py-6">
          <div>
            <h1 className="text-headline-md text-surface-on">
              Welcome, {profile.full_name || profile.username}
            </h1>
            <p className="text-body-md text-surface-on-variant mt-1">
              {profile.department || "—"}
              {profile.roll_number ? ` • ${profile.roll_number}` : ""}
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <Section
        title="Your Courses"
        subtitle="Download slides, homework, and classwork for courses you're enrolled in."
      >
        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-10">
            {courses.map((course: any) => {
              const items = grouped.get(course.id) ?? [];
              return (
                <div key={course.id}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-m-md bg-primary-container text-primary-on-container flex items-center justify-center">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h2 className="text-title-lg text-surface-on">
                        {course.name}
                      </h2>
                      {course.description && (
                        <p className="text-body-md text-surface-on-variant">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-body-md text-surface-on-variant ml-13">
                      No materials uploaded yet.
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {items.map((m) => (
                        <MaterialCard key={m.id} material={m} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-10 text-center">
      <BookOpen className="mx-auto text-primary" size={40} />
      <h3 className="mt-4 text-title-lg text-surface-on">
        You&apos;re not enrolled in any course yet
      </h3>
      <p className="mt-2 text-body-md text-surface-on-variant">
        Please contact a CADers admin to be enrolled.
      </p>
    </div>
  );
}

function MaterialCard({
  material,
}: {
  material: MaterialRow & { url: string | null };
}) {
  const Icon =
    material.type === "slide"
      ? FileText
      : material.type === "hw"
      ? ClipboardList
      : BookOpen;

  const typeLabel =
    material.type === "slide"
      ? "Slide"
      : material.type === "hw"
      ? "Homework"
      : "Classwork";

  return (
    <div className="rounded-m-lg bg-surface-container border border-outline-variant p-5 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard flex items-start gap-4">
      <div className="w-10 h-10 rounded-m-md bg-primary-container text-primary-on-container flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-label-md text-primary uppercase">{typeLabel}</p>
        <h3 className="text-title-md text-surface-on mt-1 truncate">
          {material.title}
        </h3>
        <p className="text-label-md text-surface-on-variant mt-1">
          {new Date(material.uploaded_at).toLocaleDateString("en-GB")}
        </p>
      </div>
      {material.url ? (
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-10 h-10 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary/10 transition"
          aria-label={`Download ${material.title}`}
        >
          <Download size={18} />
        </a>
      ) : (
        <span className="shrink-0 text-label-md text-surface-on-variant">
          N/A
        </span>
      )}
    </div>
  );
}