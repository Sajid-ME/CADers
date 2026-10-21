"use client";

import { Download } from "lucide-react";

type StudentData = {
  id: string;
  username: string;
  full_name: string;
  department: string | null;
  roll_number: string | null;
  created_at: string;
};

export default function ExportStudentsCsvButton({
  students,
}: {
  students: StudentData[];
}) {
  function handleExport() {
    if (!students || students.length === 0) return;

    const escape = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`;

    const headers = ["Full Name", "Username", "Department", "Roll Number", "Created At"];
    const rows = students.map((s) => [
      escape(s.full_name),
      escape(s.username),
      escape(s.department || "N/A"),
      escape(s.roll_number || "N/A"),
      escape(new Date(s.created_at).toLocaleDateString("en-GB")),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `caders_students_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!students || students.length === 0) return null;

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-label-md text-surface-on-variant hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
      title="Export all students to CSV"
    >
      <Download size={14} />
      <span>Export CSV</span>
    </button>
  );
}
