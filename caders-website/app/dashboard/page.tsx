import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import {
  FileText,
  ClipboardList,
  BookOpen,
  Download,
  GraduationCap,
  Layers,
} from "lucide-react";

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

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      "id, enrolled_at, courses:course_id (id, name, description, order_index)"
    )
    .eq("student_id", user.id);

  const { data: materials } = await supabase
    .from("materials")
    .select("id, course_id, type, title, file_path, uploaded_at")
    .order("uploaded_at", { ascending: false });

  const rawMaterials = (materials ?? []) as MaterialRow[];
  let materialsWithUrls: (MaterialRow & { url: string | null })[] = [];

  if (rawMaterials.length > 0) {
    try {
      const filePaths = rawMaterials.map((m) => m.file_path);
      const { data: signedData } = await supabase.storage
        .from("materials")
        .createSignedUrls(filePaths, 3600);

      const signedUrlMap = new Map<string, string | null>();
      if (signedData) {
        for (const item of signedData) {
          if (item?.path && item?.signedUrl) {
            signedUrlMap.set(item.path, item.signedUrl);
          }
        }
      }

      materialsWithUrls = rawMaterials.map((m) => ({
        ...m,
        url: signedUrlMap.get(m.file_path) ?? null,
      }));
    } catch {
      materialsWithUrls = rawMaterials.map((m) => ({ ...m, url: null }));
    }
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

  const displayName = profile.full_name || profile.username;
  const initial = displayName.charAt(0).toUpperCase();

  // Compute quick stats
  const totalMaterials = materialsWithUrls.length;
  const totalCourses = courses.length;

  return (
    <Section>
      {/* ── Welcome card ── */}
      <div className="mb-10 rounded-m-xl bg-gradient-to-br from-primary-container via-surface-container to-surface-container border border-outline-variant p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-elev-1">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-on flex items-center justify-center text-headline-md font-bold shrink-0 shadow-elev-2"
          aria-hidden
        >
          {initial}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-label-md text-primary uppercase tracking-widest">
            Student Portal
          </p>
          <h1 className="text-headline-md text-surface-on truncate">
            Welcome back, {displayName.split(" ")[0]}!
          </h1>
          <p className="text-body-md text-surface-on-variant mt-1">
            {profile.department || "—"}
            {profile.roll_number ? ` • Roll: ${profile.roll_number}` : ""}
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-6 shrink-0">
          <div className="text-center">
            <p className="text-headline-md text-primary font-bold">{totalCourses}</p>
            <p className="text-label-md text-surface-on-variant">Courses</p>
          </div>
          <div className="w-px bg-outline-variant" />
          <div className="text-center">
            <p className="text-headline-md text-primary font-bold">{totalMaterials}</p>
            <p className="text-label-md text-surface-on-variant">Materials</p>
          </div>
        </div>
      </div>

      {/* ── Section heading ── */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-m-md bg-primary-container text-primary-on-container flex items-center justify-center">
          <Layers size={18} />
        </div>
        <div>
          <h2 className="text-title-lg text-surface-on">Your Courses</h2>
          <p className="text-body-md text-surface-on-variant">
            Download slides, homework, and classwork.
          </p>
        </div>
      </div>

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
                    <h3 className="text-title-lg text-surface-on">
                      {course.name}
                    </h3>
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
  );
}

function EmptyState() {
  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-12 text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-4">
        <GraduationCap className="text-primary-on-container" size={36} />
      </div>
      <h3 className="mt-4 text-title-lg text-surface-on">
        No courses yet
      </h3>
      <p className="mt-2 text-body-md text-surface-on-variant max-w-xs mx-auto">
        You&apos;re not enrolled in any course yet. Please contact a CADers admin
        to be enrolled.
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

  const typeColor =
    material.type === "slide"
      ? "text-primary bg-primary-container"
      : material.type === "hw"
      ? "text-tertiary-on bg-tertiary-container"
      : "text-secondary-on bg-secondary-container";

  return (
    <div className="rounded-m-lg bg-surface-container border border-outline-variant p-5 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard flex items-start gap-4 group">
      <div
        className={`w-10 h-10 rounded-m-md flex items-center justify-center shrink-0 ${typeColor}`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-label-md uppercase tracking-wider text-surface-on-variant">
          {typeLabel}
        </p>
        <h4 className="text-title-md text-surface-on mt-1 truncate">
          {material.title}
        </h4>
        <p className="text-label-md text-surface-on-variant mt-1">
          {new Date(material.uploaded_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      {material.url ? (
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-10 h-10 rounded-full inline-flex items-center justify-center text-primary hover:bg-primary/10 transition"
          aria-label={`Download ${material.title}`}
          title={`Download ${material.title}`}
        >
          <Download size={18} />
        </a>
      ) : (
        <span className="shrink-0 text-label-md text-surface-on-variant px-2">
          N/A
        </span>
      )}
    </div>
  );
}