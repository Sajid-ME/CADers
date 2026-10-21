"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Users, GraduationCap, FileSpreadsheet, UserPlus } from "lucide-react";
import BulkStudentImport from "./BulkStudentImport";
import AddStudentForm from "./AddStudentForm";
import StudentRow from "./StudentRow";
import ExportStudentsCsvButton from "./ExportStudentsCsvButton";
import CreateCourseForm from "../enrollments/CreateCourseForm";
import EnrollForm from "../enrollments/EnrollForm";
import CourseRow from "../enrollments/CourseRow";
import EnrollmentRow from "../enrollments/EnrollmentRow";

type Props = {
  students: Array<{
    id: string;
    username: string;
    full_name: string;
    department: string | null;
    roll_number: string | null;
    created_at: string;
  }>;
  courses: Array<{
    id: string;
    name: string;
    order_index: number;
  }>;
  enrollments: any[];
  studentCourseMap: Record<string, string[]>;
};

export default function AdminStudentsHub({
  students,
  courses,
  enrollments,
  studentCourseMap,
}: Props) {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "courses" ? "courses" : "students";
  const [activeTab, setActiveTab] = useState<"students" | "courses">(initialTab);
  const [subTab, setSubTab] = useState<"bulk" | "single">("bulk");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "courses") setActiveTab("courses");
    else if (tabParam === "students") setActiveTab("students");
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {/* Primary Section Switcher */}
      <div className="flex flex-wrap items-center gap-3 border-b border-outline-variant pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-label-lg transition-all ${
            activeTab === "students"
              ? "bg-primary text-primary-on font-semibold shadow-md"
              : "bg-surface-variant text-surface-on-variant hover:text-primary hover:bg-primary/10"
          }`}
        >
          <Users size={18} />
          <span>Students & Enrollment</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-surface/30">
            {students.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-label-lg transition-all ${
            activeTab === "courses"
              ? "bg-primary text-primary-on font-semibold shadow-md"
              : "bg-surface-variant text-surface-on-variant hover:text-primary hover:bg-primary/10"
          }`}
        >
          <GraduationCap size={18} />
          <span>Courses & Active Enrollments</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-surface/30">
            {courses.length}
          </span>
        </button>
      </div>

      {activeTab === "students" ? (
        <div className="space-y-8">
          {/* Subtabs for single vs batch creation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubTab("bulk")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-label-md transition-all ${
                subTab === "bulk"
                  ? "bg-secondary-container text-secondary-on-container font-semibold border border-secondary/30"
                  : "bg-surface-variant/60 text-surface-on-variant hover:text-primary"
              }`}
            >
              <FileSpreadsheet size={15} />
              <span>Bulk CSV Import & Enroll</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab("single")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-label-md transition-all ${
                subTab === "single"
                  ? "bg-secondary-container text-secondary-on-container font-semibold border border-secondary/30"
                  : "bg-surface-variant/60 text-surface-on-variant hover:text-primary"
              }`}
            >
              <UserPlus size={15} />
              <span>Single Student Account</span>
            </button>
          </div>

          {subTab === "bulk" ? (
            <BulkStudentImport courses={courses} />
          ) : (
            <AddStudentForm courses={courses} />
          )}

          {/* All Students Table */}
          <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
            <div className="px-6 py-4 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-title-md text-surface-on">
                  All Students ({students.length})
                </h3>
                <p className="text-label-md text-surface-on-variant">
                  Enrolled courses and credentials managed by CADers
                </p>
              </div>
              <ExportStudentsCsvButton students={students} />
            </div>

            {students.length === 0 ? (
              <div className="p-10 text-center text-body-md text-surface-on-variant">
                No students yet. Create or import above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high">
                    <tr className="text-label-md text-surface-on-variant uppercase">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Username</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Roll</th>
                      <th className="px-6 py-3">Enrolled Courses</th>
                      <th className="px-6 py-3">Created</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {students.map((s) => (
                      <StudentRow
                        key={s.id}
                        student={s}
                        courses={studentCourseMap[s.id] || []}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Courses & Enrollments Tab */
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <CreateCourseForm />
            <EnrollForm students={students} courses={courses} />
          </div>

          {/* Courses List */}
          <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
            <div className="px-6 py-4 border-b border-outline-variant">
              <h3 className="text-title-md text-surface-on">
                Manage Courses ({courses.length})
              </h3>
            </div>

            {courses.length === 0 ? (
              <div className="p-10 text-center text-body-md text-surface-on-variant">
                No courses created yet. Create one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high">
                    <tr className="text-label-md text-surface-on-variant uppercase">
                      <th className="px-6 py-3">Course Name</th>
                      <th className="px-6 py-3">Order</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {courses.map((c) => (
                      <CourseRow key={c.id} course={c} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Enrollments List */}
          <div className="rounded-m-xl bg-surface-container border border-outline-variant overflow-hidden shadow-elev-1">
            <div className="px-6 py-4 border-b border-outline-variant">
              <h3 className="text-title-md text-surface-on">
                All Active Enrollments ({enrollments.length})
              </h3>
            </div>

            {enrollments.length === 0 ? (
              <div className="p-10 text-center text-body-md text-surface-on-variant">
                No active enrollments yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-high">
                    <tr className="text-label-md text-surface-on-variant uppercase">
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Username</th>
                      <th className="px-6 py-3">Course</th>
                      <th className="px-6 py-3">Enrolled</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {enrollments.map((e: any) => (
                      <EnrollmentRow key={e.id} enrollment={e} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
