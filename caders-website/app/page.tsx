import Section from "@/components/Section";
import Hero from "@/components/Hero";
import AchievementSlideshow from "@/components/AchievementSlideshow";
import VoicesSlideshow from "@/components/VoicesSlideshow";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
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
      .order("date", { ascending: false })
      .limit(3),
    supabase
      .from("voices")
      .select("id, type, name, designation, message")
      .order("order_index"),
  ]);

  const achievements = achRes.data ?? [];
  const events = evtRes.data ?? [];
  const voices = voiceRes.data ?? [];

  return (
    <>
      <Hero />

      <Section
        title="Our Achievements"
        subtitle="Milestones that define who we are."
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
        title="Recent & Upcoming Events"
        subtitle="Join our workshops, bootcamps, and design sprints."
        className="bg-surface-container"
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
        title="Voices from Our Community"
        subtitle="What our moderator and faculty advisor say."
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

      <Section>
        <div className="rounded-m-xl bg-primary text-primary-on p-10 md:p-16 text-center shadow-elev-2">
          <h2 className="text-headline-md md:text-headline-lg">
            Have feedback? We&apos;re listening.
          </h2>
          <p className="mt-4 text-body-lg text-primary-on/85 max-w-xl mx-auto">
            Whether you&apos;re enrolled or just curious — share your thoughts on
            our courses and syllabus. Anonymous and always welcome.
          </p>
          <div className="mt-8 inline-block">
            <Button href="/feedback" variant="elevated" size="lg">
              Give Feedback
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}