export type Achievement = {
  id: number;
  title: string;
  description: string;
  date: string;
};

export type EventItem = {
  id: number;
  title: string;
  date: string;
  venue: string;
  description: string;
};

export type Voice = {
  id: number;
  type: "moderator" | "faculty";
  name: string;
  designation: string;
  message: string;
};

export const achievements: Achievement[] = [
  {
    id: 1,
    title: "1st Place — National CAD Contest 2024",
    description: "Team CADers secured first place among 40+ university teams.",
    date: "March 2024",
  },
  {
    id: 2,
    title: "Best Innovation Award — TechFest 2023",
    description: "Recognized for a sustainable design project at KUET TechFest.",
    date: "November 2023",
  },
  {
    id: 3,
    title: "Top 5 — Inter-University Design Challenge",
    description: "Ranked among the top 5 teams nationally in a design competition.",
    date: "August 2023",
  },
  {
    id: 4,
    title: "300+ Students Trained",
    description: "Over 300 students successfully completed our CAD training program.",
    date: "Ongoing",
  },
];

export const events: EventItem[] = [
  {
    id: 1,
    title: "AutoCAD Bootcamp — Batch 12",
    date: "2025-01-15",
    venue: "CAD Lab, KUET",
    description: "Hands-on training on AutoCAD fundamentals and drafting.",
  },
  {
    id: 2,
    title: "SolidWorks Advanced Workshop",
    date: "2025-02-10",
    venue: "Seminar Room, ME Building",
    description: "Advanced 3D modeling and simulation using SolidWorks.",
  },
  {
    id: 3,
    title: "Design Sprint 2025",
    date: "2025-03-05",
    venue: "Auditorium, KUET",
    description: "A 48-hour design sprint for teams to solve real-world problems.",
  },
];

export const voices: Voice[] = [
  {
    id: 1,
    type: "moderator",
    name: "Moderator Name",
    designation: "Moderator, CADers",
    message:
      "CADers has always been about more than software — it's about shaping how our students think, design, and solve problems. I'm proud to see our community grow every year.",
  },
  {
    id: 2,
    type: "faculty",
    name: "Faculty Advisor Name",
    designation: "Faculty Advisor, CADers",
    message:
      "Engineering is a language, and CAD is its alphabet. Our goal is to help every student speak that language fluently and with confidence.",
  },
  {
    id: 3,
    type: "moderator",
    name: "Moderator Name",
    designation: "Moderator, CADers",
    message:
      "We don't just teach tools — we build designers. Every workshop, every session, every contest is a step toward that mission.",
  },
];