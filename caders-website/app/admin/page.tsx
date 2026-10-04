import Link from "next/link";
import { Users, FileText, Calendar, Trophy, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [studentsRes, coursesRes, materialsRes, eventsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student"),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("materials").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Students",
      value: studentsRes.count ?? 0,
      icon: Users,
      href: "/admin/students",
    },
    {
      label: "Materials",
      value: materialsRes.count ?? 0,
      icon: FileText,
      href: "/admin/materials",
    },
    {
      label: "Events",
      value: eventsRes.count ?? 0,
      icon: Calendar,
      href: "/admin/events",
    },
    {
      label: "Courses",
      value: coursesRes.count ?? 0,
      icon: Trophy,
      href: "/admin/enrollments",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-headline-md text-surface-on">Overview</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Quick stats and shortcuts.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-m-xl bg-surface-container border border-outline-variant p-6 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-m-md bg-primary-container text-primary-on-container flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <ArrowRight
                  size={18}
                  className="text-surface-on-variant group-hover:text-primary transition"
                />
              </div>
              <p className="mt-5 text-display-md text-surface-on">{s.value}</p>
              <p className="text-body-md text-surface-on-variant mt-1">
                {s.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-m-xl bg-primary-container p-8 md:p-10">
        <h3 className="text-title-lg text-primary-on-container">
          Welcome to the CADers admin panel
        </h3>
        <p className="mt-2 text-body-md text-primary-on-container/80 max-w-xl">
          Use the tabs above to manage students, courses, materials, events,
          and more. Changes go live on the public site instantly.
        </p>
      </div>
    </div>
  );
}