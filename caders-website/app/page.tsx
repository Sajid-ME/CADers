import Section from "@/components/Section";
import Hero from "@/components/Hero";
import AchievementSlideshow from "@/components/AchievementSlideshow";
import VoicesSlideshow from "@/components/VoicesSlideshow";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import ContactSection from "@/components/ContactSection";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const [achRes, evtRes, voiceRes] = await Promise.all([
    supabase
      .from("achievements")
      .select("id, title, description, date")
      .order("created_at", { ascending: false }),
    supabase
      .from("events")
      .select("id, title, date, venue, description")
      .order("date", { ascending: true }),
    supabase
      .from("voices")
      .select("id, type, name, designation, message")
      .order("order_index"),
  ]);

  const achievements = achRes.data ?? [];
  const voices = voiceRes.data ?? [];

  const today = new Date().toISOString().slice(0, 10);
  const allEvents = evtRes.data ?? [];
  const upcoming = allEvents.filter((e) => e.date >= today);
  const recentPast = allEvents
    .filter((e) => e.date < today)
    .reverse();
  const events = [...upcoming, ...recentPast].slice(0, 3);

  return (
    <>
      <div id="home">
        <Hero />
      </div>

      <Section
        id="achievements"
        title="Our Achievements"
        subtitle="Milestones that define who we are."
        tone="fresh"
      >
        {achievements.length > 0 ? (
          <AchievementSlideshow items={achievements} />
        ) : (
          <p className="text-center text-body-md text-surface-on-variant">
            No achievements yet.
          </p>
        )}
        <div className="text-center mt-10">
          <Button href="/achievements" variant="text" size="md">
            View all achievements →
          </Button>
        </div>
      </Section>

      <Section
        id="events"
        title="Recent & Upcoming Events"
        subtitle="Join our workshops, bootcamps, and design sprints."
        tone="deep"
      >
        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="text-center text-body-md text-surface-on-variant">
            No events yet.
          </p>
        )}
        <div className="text-center mt-10">
          <Button href="/events" variant="text" size="md">
            See all events →
          </Button>
        </div>
      </Section>

      <Section
        id="voices"
        title="Voices from Our Community"
        subtitle="What our moderator and faculty advisor say."
        tone="fresh"
      >
        <div className="max-w-3xl mx-auto">
          {voices.length > 0 ? (
            <VoicesSlideshow items={voices} />
          ) : (
            <p className="text-center text-body-md text-surface-on-variant">
              Voices coming soon.
            </p>
          )}
        </div>
      </Section>

      <Section
        id="contact"
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out anytime."
        tone="deep"
      >
        <ContactSection />
      </Section>
    </>
  );
}