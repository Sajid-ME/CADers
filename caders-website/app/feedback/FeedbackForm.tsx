"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!message.trim()) return;

    setLoading(true);

    const url = process.env.NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL;
    if (!url) {
      setError("Feedback is temporarily unavailable. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          message: message.trim(),
          source: "web",
        }),
      });

      setSubmitted(true);
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
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
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-m-xl bg-surface-container border border-outline-variant p-8 shadow-elev-1"
    >
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
          maxLength={5000}
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

      {error && (
        <div className="mt-4 rounded-m-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

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
  );
}