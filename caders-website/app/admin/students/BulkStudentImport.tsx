"use client";

import { useState, useTransition, useRef } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Button from "@/components/Button";
import { bulkImportStudentsAction, type BulkImportResult } from "../actions";

type CourseOption = {
  id: string;
  name: string;
};

export default function BulkStudentImport({
  courses,
}: {
  courses: CourseOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Downloads the standard sample CSV template
  function downloadSampleTemplate() {
    const sampleCsv = [
      "full_name,department,roll_number",
      "Sajid Hasan,ME,2105021",
      "Tanvir Ahmed,CSE,2107015",
      "Anika Rahman,EEE,2103042",
      "Fahim Shahriar,CE,2101033",
      "Nusrat Jahan,ARCH,2125010",
    ].join("\r\n");

    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "caders_student_import_template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  // Trigger download of the generated credentials CSV
  function downloadGeneratedCsv(csvData: string) {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `caders_generated_credentials_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedCourse) {
      formData.append("course_id", selectedCourse);
    }

    startTransition(async () => {
      const res = await bulkImportStudentsAction(formData);
      setResult(res);

      // Auto-download the credentials CSV if generation succeeded
      if (res.csvData && res.successCount && res.successCount > 0) {
        downloadGeneratedCsv(res.csvData);
      }
    });
  }

  function handleReset() {
    setResult(null);
    setSelectedFile(null);
    setSelectedCourse("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function copyText(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-m-xl bg-surface-container border border-outline-variant p-6 md:p-8 shadow-elev-1 space-y-6">
      {/* Header with Sample Download */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant">
        <div>
          <h3 className="text-title-md text-surface-on flex items-center gap-2">
            <FileSpreadsheet className="text-primary" size={20} />
            Bulk CSV Student Import & Auto-Enrollment
          </h3>
          <p className="text-body-md text-surface-on-variant mt-1">
            Import hundreds of students at once. Usernames, emails, and secure passwords will be generated automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/5 text-label-md transition-all shrink-0 self-start sm:self-center"
        >
          <Download size={15} />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* File Upload Dropzone */}
            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-m-lg p-6 bg-surface-variant/40 transition-colors cursor-pointer text-center group">
              <input
                ref={fileInputRef}
                id="csv_file"
                name="file"
                type="file"
                accept=".csv,text/csv"
                required
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload
                className="text-surface-on-variant group-hover:text-primary transition-colors mb-3"
                size={32}
              />
              <p className="text-title-md text-surface-on font-medium">
                {selectedFile ? selectedFile.name : "Choose CSV file or drag here"}
              </p>
              <p className="text-label-md text-surface-on-variant mt-1">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                  : "Must include columns: full_name, department, roll_number"}
              </p>
            </div>

            {/* Optional Auto-Enrollment Course Selector */}
            <div className="flex flex-col justify-center space-y-4 rounded-m-lg border border-outline-variant p-6 bg-surface-variant/20">
              <div>
                <label
                  htmlFor="course_id"
                  className="block text-label-lg text-surface-on font-medium mb-1.5"
                >
                  Auto-Enroll in Course (Optional)
                </label>
                <p className="text-label-md text-surface-on-variant mb-3">
                  All successfully imported students will automatically be enrolled into this course.
                </p>
                <select
                  id="course_id"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-m-md bg-surface border border-outline px-4 py-3 text-body-md text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all"
                >
                  <option value="">None (Create accounts only)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="filled"
                  size="lg"
                  fullWidth
                  disabled={!selectedFile || isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Creating Students & Generating Passwords...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Import Students & Generate CSV</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Summary Banner */}
          <div
            className={`p-5 rounded-m-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              result.error
                ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
                : "bg-primary-container/40 border-primary/30 text-primary-on-container"
            }`}
          >
            <div className="flex items-center gap-3">
              {result.error ? (
                <AlertCircle className="text-red-500 shrink-0" size={24} />
              ) : (
                <CheckCircle2 className="text-primary shrink-0" size={24} />
              )}
              <div>
                <h4 className="text-title-md font-semibold text-surface-on">
                  {result.error
                    ? "Import Failed"
                    : `Batch Complete: ${result.successCount ?? 0} Created Successfully`}
                </h4>
                <p className="text-body-md text-surface-on-variant mt-0.5">
                  {result.error
                    ? result.error
                    : `${result.failureCount ?? 0} errors out of ${
                        result.totalCount ?? 0
                      } rows parsed. The credentials CSV was downloaded.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {result.csvData && (
                <button
                  type="button"
                  onClick={() => downloadGeneratedCsv(result.csvData!)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-primary text-primary-on text-label-md hover:bg-primary-dark transition shadow-sm"
                >
                  <Download size={15} />
                  <span>Download Credentials CSV</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-outline text-surface-on hover:bg-surface-variant text-label-md transition"
              >
                <RefreshCw size={14} />
                <span>Import Another</span>
              </button>
            </div>
          </div>

          {/* Table Preview of Generated Credentials */}
          {result.results && result.results.length > 0 && (
            <div className="border border-outline-variant rounded-m-lg overflow-hidden">
              <div className="px-5 py-3.5 bg-surface-container-high border-b border-outline-variant flex items-center justify-between">
                <span className="text-label-md text-surface-on font-medium uppercase tracking-wider">
                  Generated Credentials Preview ({result.results.length})
                </span>
                <span className="text-label-md text-surface-on-variant">
                  Passwords are only visible once here and in the downloaded CSV
                </span>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-body-md">
                  <thead className="bg-surface-variant/40 sticky top-0 border-b border-outline-variant">
                    <tr className="text-label-md text-surface-on-variant uppercase">
                      <th className="px-5 py-2.5">Name</th>
                      <th className="px-5 py-2.5">Roll & Dept</th>
                      <th className="px-5 py-2.5">Username</th>
                      <th className="px-5 py-2.5">Generated Password</th>
                      <th className="px-5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {result.results.map((r, idx) => (
                      <tr
                        key={idx}
                        className={
                          r.status === "error"
                            ? "bg-red-500/5 text-red-700 dark:text-red-300"
                            : "hover:bg-primary/5 transition-colors"
                        }
                      >
                        <td className="px-5 py-3 font-medium text-surface-on">
                          {r.fullName}
                        </td>
                        <td className="px-5 py-3 text-surface-on-variant">
                          {r.rollNumber} • {r.department}
                        </td>
                        <td className="px-5 py-3 font-mono text-primary">
                          {r.username}
                        </td>
                        <td className="px-5 py-3">
                          {r.password ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-surface-variant px-2.5 py-1 rounded text-surface-on font-semibold tracking-wider">
                                {r.password}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyText(r.password!, idx)}
                                aria-label="Copy password"
                                className="p-1.5 rounded-full hover:bg-primary/10 text-surface-on-variant hover:text-primary transition"
                              >
                                {copiedIndex === idx ? (
                                  <Check size={14} className="text-primary" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-red-500 text-label-md">
                              {r.error || "Failed"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {r.status === "success" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                              Created
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 uppercase">
                              Error
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
