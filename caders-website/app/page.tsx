import Link from "next/link";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import AchievementSlideshow from "@/components/AchievementSlideshow";
import VoicesSlideshow from "@/components/VoicesSlideshow";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import { achievements, events, voices } from "@/lib/data";

export default function HomePage() {
  const upcoming = events.slice(0, 3);

  return (
    <>
      <Hero />

      <Section
        title="Our Achievements"
        subtitle="Milestones that define who we are."
      >
        <AchievementSlideshow items={achievements} />
        <div className="text-center mt-10">
          <Button href="/achievements" variant="text" size="md">
            View all achievements →
          </Button>
        </div>
      </Section>

      <Section
        title="Upcoming Events"
        subtitle="Join our workshops, bootcamps, and design sprints."
        className="bg-surface-container"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
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
          <VoicesSlideshow items={voices} />
        </div>
      </Section>

      <Section>
        <div className="rounded-m-xl bg-primary text-white p-10 md:p-16 text-center shadow-elev-2">
          <h2 className="text-headline-md md:text-headline-lg">
            Have feedback? We&apos;re listening.
          </h2>
          <p className="mt-4 text-body-lg text-white/85 max-w-xl mx-auto">
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