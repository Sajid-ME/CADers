import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { createClient } from "@/lib/supabase/server";
import FeedbackForm from "./FeedbackForm";

export const metadata = {
  title: "Feedback | CADers",
  description: "Share your feedback on CADers courses and syllabus.",
};

export default async function FeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    return (
      <Section
        title="Share Your Feedback"
        subtitle="Reserved for enrolled CADers students and committee members."
      >
        <GateCard
          icon="🔒"
          title="Login required"
          body="Feedback is open to enrolled CADers students and committee members. Please sign in to continue."
          ctaHref="/login"
          ctaLabel="Sign in"
        />
      </Section>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin =
    profile?.role === "admin" || profile?.role === "super_admin";

  if (!isAdmin) {
    const { count } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("student_id", user.id);

    if (!count || count === 0) {
      return (
        <Section
          title="Share Your Feedback"
          subtitle="Reserved for enrolled CADers students and committee members."
        >
          <GateCard
            icon="📚"
            title="Enrollment required"
            body="Feedback is open to students who are enrolled in at least one CADers course. Contact an admin if you believe this is a mistake."
            ctaHref="/contact"
            ctaLabel="Contact us"
          />
        </Section>
      );
    }
  }

  return (
    <Section
      title="Share Your Feedback"
      subtitle="Anonymous. Honest. Welcome. Help us improve our courses and syllabus."
    >
      <div className="max-w-2xl mx-auto">
        <FeedbackForm />
      </div>
    </Section>
  );
}

function GateCard({
  icon,
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  icon: string;
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="max-w-xl mx-auto rounded-m-xl bg-surface-container border border-outline-variant p-10 text-center shadow-elev-1">
      <div className="text-display-md">{icon}</div>
      <h3 className="mt-4 text-title-lg text-surface-on">{title}</h3>
      <p className="mt-3 text-body-md text-surface-on-variant">{body}</p>
      <div className="mt-8 inline-block">
        <Button href={ctaHref} variant="filled" size="md">
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}