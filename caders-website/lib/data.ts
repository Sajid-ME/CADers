export type Achievement = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string | null;
};

export type Voice = {
  id: string;
  type: "moderator" | "faculty";
  name: string;
  designation: string | null;
  message: string;
};