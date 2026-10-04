import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | CADers",
  description: "Sign in to access your CADers student portal.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-secondary/15 blur-[120px]" />

      <div className="container relative max-w-md">
        <div className="rounded-m-xl bg-surface-container border border-outline-variant p-8 md:p-10 shadow-elev-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-m-md bg-gradient-to-br from-primary to-secondary text-primary-on flex items-center justify-center font-bold shadow-elev-1">
              C
            </div>
            <div>
              <h1 className="text-title-lg text-surface-on">Sign In</h1>
              <p className="text-body-md text-surface-on-variant">
                CADers Student Portal
              </p>
            </div>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-body-md text-surface-on-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact an admin
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-label-md text-surface-on-variant">
          Accounts are created by CADers administrators only.
        </p>
      </div>
    </div>
  );
}