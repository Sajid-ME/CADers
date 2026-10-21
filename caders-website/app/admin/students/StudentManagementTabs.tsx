"use client";

import { useState } from "react";
import { FileSpreadsheet, UserPlus } from "lucide-react";
import AddStudentForm from "./AddStudentForm";
import BulkStudentImport from "./BulkStudentImport";

type CourseOption = {
  id: string;
  name: string;
};

export default function StudentManagementTabs({
  courses,
}: {
  courses: CourseOption[];
}) {
  const [activeTab, setActiveTab] = useState<"bulk" | "single">("bulk");

  return (
    <div className="space-y-6">
      {/* Switcher Pills */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("bulk")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-label-lg transition-all ${
            activeTab === "bulk"
              ? "bg-primary text-primary-on font-semibold shadow-sm"
              : "bg-surface-variant text-surface-on-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <FileSpreadsheet size={16} />
          <span>Bulk CSV Import & Enroll</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("single")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-label-lg transition-all ${
            activeTab === "single"
              ? "bg-primary text-primary-on font-semibold shadow-sm"
              : "bg-surface-variant text-surface-on-variant hover:text-primary hover:bg-primary/5"
          }`}
        >
          <UserPlus size={16} />
          <span>Single Student Account</span>
        </button>
      </div>

      {activeTab === "bulk" ? (
        <BulkStudentImport courses={courses} />
      ) : (
        <AddStudentForm />
      )}
    </div>
  );
}
