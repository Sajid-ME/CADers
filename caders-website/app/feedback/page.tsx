"use client";

import { useState } from "react";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    // 🔌 TODO (Phase 4): send `message` to Google Apps Script endpoint
    console.log("Feedback submitted:", message);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setMessage("");
    }, 600);
  }

  return (
    <Section
      title="Share Your Feedback"
      subtitle="Anonymous. Honest. Welcome. Help us improve our courses and syllabus."
    >
      <div className="max-w-2xl mx-auto">
        {submitted ? (
          <div className="rounded-m-xl bg-primary-container border border-primary/20 p-10 text-center shadow-elev-1">
            <h3 className="text-title-lg text-primary-on-container">
              Thank you for your feedback!
            </h3>
            <p className="mt-3 text-body-md text-primary-on-container/80">
              Your response has been recorded anonymously.
            </p>
            <div className="mt-8 inline-block">
              <Button
                variant="outlined"
                size="md"
                onClick={() => setSubmitted(false)}
              >
                Submit another
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-m-xl bg-surface-container border border-outline-variant p-8 shadow-elev-1"
          >
            {/* Material filled text field */}
            <div className="relative">
              <textarea
                id="feedback"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={7}
                required
                placeholder=" "
                className="peer w-full rounded-m-md bg-surface-variant border border-outline px-4 pt-6 pb-3 text-body-lg text-surface-on focus:outline-none focus:border-primary focus:border-2 transition-all duration-m-short ease-m-standard resize-none"
              />
              <label
                htmlFor="feedback"
                className={`absolute left-4 transition-all duration-m-short ease-m-standard pointer-events-none ${
                  focused || message
                    ? "top-2 text-label-md text-primary"
                    : "top-5 text-body-md text-surface-on-variant"
                }`}
              >
                Your feedback
              </label>
            </div>

            <p className="mt-3 text-label-md text-surface-on-variant">
              Your feedback is completely anonymous. Please don&apos;t include
              personal information.
            </p>

            <div className="mt-6">
              <Button
                type="submit"
                variant="filled"
                size="lg"
                disabled={loading || !message.trim()}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}