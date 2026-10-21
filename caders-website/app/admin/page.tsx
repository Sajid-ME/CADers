import Link from "next/link";
import {
  Users,
  FileText,
  Calendar,
  Trophy,
  ArrowRight,
  MessageSquare,
  LogIn,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// Update this to your actual Google Sheet URL
const FEEDBACK_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-UYnKn7X4u9Z5NdMUUwpZL87GL2-T8pG3JCFI8Qdlls/edit";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [studentsRes, coursesRes, materialsRes, eventsRes, logsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "student"),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("materials").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase
        .from("login_logs")
        .select("id", { count: "exact", head: true }),
    ]);

  const stats = [
    {
      label: "Students",
      value: studentsRes.count ?? 0,
      icon: Users,
      href: "/admin/students",
      color: "bg-primary-container text-primary-on-container",
    },
    {
      label: "Materials",
      value: materialsRes.count ?? 0,
      icon: FileText,
      href: "/admin/materials",
      color: "bg-secondary-container text-secondary-on-container",
    },
    {
      label: "Events",
      value: eventsRes.count ?? 0,
      icon: Calendar,
      href: "/admin/events",
      color: "bg-tertiary-container text-tertiary-on-container",
    },
    {
      label: "Courses",
      value: coursesRes.count ?? 0,
      icon: Trophy,
      href: "/admin/students?tab=courses",
      color: "bg-primary-container text-primary-on-container",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div>
        <h2 className="text-headline-md text-surface-on">Overview</h2>
        <p className="text-body-md text-surface-on-variant mt-1">
          Quick stats and shortcuts to manage the club.
        </p>
      </div>

      {/* Stat cards */}
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
                <div
                  className={`w-11 h-11 rounded-m-md flex items-center justify-center ${s.color}`}
                >
                  <Icon size={20} />
                </div>
                <ArrowRight
                  size={18}
                  className="text-surface-on-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all"
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

      {/* Quick-action row */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Feedback Google Sheet */}
        <a
          href={FEEDBACK_SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-m-xl bg-surface-container border border-outline-variant p-6 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-m-md bg-tertiary-container text-tertiary-on-container flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-title-md text-surface-on">
                  View all feedback
                </h3>
                <p className="mt-0.5 text-body-md text-surface-on-variant">
                  Opens the CADers Feedback Google Sheet
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="shrink-0 text-surface-on-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </a>

        {/* Login logs */}
        <Link
          href="/admin/logs"
          className="group block rounded-m-xl bg-surface-container border border-outline-variant p-6 shadow-elev-1 hover:shadow-elev-3 transition-all duration-m-medium ease-m-standard"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-m-md bg-surface-variant text-surface-on flex items-center justify-center">
                <LogIn size={20} />
              </div>
              <div>
                <h3 className="text-title-md text-surface-on">Login logs</h3>
                <p className="mt-0.5 text-body-md text-surface-on-variant">
                  {logsRes.count ?? 0} total login events recorded
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="shrink-0 text-surface-on-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </Link>
      </div>

      {/* Welcome banner */}
      <div className="rounded-m-xl bg-gradient-to-br from-primary-container to-surface-container border border-primary/10 p-8 md:p-10">
        <h3 className="text-title-lg text-primary-on-container">
          Welcome to the CADers admin panel
        </h3>
        <p className="mt-2 text-body-md text-primary-on-container/80 max-w-xl">
          Use the tabs above to manage students, courses, materials, events, and
          more. All changes go live on the public site instantly.
        </p>
      </div>
    </div>
  );
}