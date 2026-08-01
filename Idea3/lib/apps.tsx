import SplitBill from "@/app/components/apps/SplitBill";
import HabitTracker from "@/app/components/apps/HabitTracker";
import Countdown from "@/app/components/apps/Countdown";
import Expenses from "@/app/components/apps/Expenses";
import Pomodoro from "@/app/components/apps/Pomodoro";
import Flashcards from "@/app/components/apps/Flashcards";
import TripApp from "@/app/components/apps/TripApp";

export type Demo = {
  id: string;
  chip: string;
  title: string;
  /** how many screens the generated app has */
  screens: number;
  prompt: string;
  file: string;
  /** what a dev should notice about it */
  shows: string;
  what: string;
  app: () => React.ReactElement;
};

export const DEMOS: Demo[] = [
  {
    id: "trip",
    chip: "Split a trip",
    title: "Trip expenses",
    screens: 4,
    prompt: "an app to track what we all spent on our goa trip and who owes who",
    file: "trip/",
    shows: "4 screens, tab bar, shared state",
    what: "Four screens sharing one state. Add a spend, switch tabs, add someone, watch every balance change.",
    app: () => <TripApp />,
  },
  {
    id: "split",
    chip: "Split a bill",
    title: "Bill splitter",
    screens: 1,
    prompt: "an app to split the bill with my friends, with tip",
    file: "split.tsx",
    shows: "Derived state",
    what: "Change the total, the tip or the headcount. Everything recalculates as you go.",
    app: () => <SplitBill />,
  },
  {
    id: "expenses",
    chip: "Track spending",
    title: "Expense log",
    screens: 1,
    prompt: "let me log what i spend today and see the total",
    file: "expenses.tsx",
    shows: "List state, add and remove",
    what: "Type something and add it. Remove a row. The total follows.",
    app: () => <Expenses />,
  },
  {
    id: "pomodoro",
    chip: "Focus timer",
    title: "Pomodoro",
    screens: 1,
    prompt: "a 25 minute focus timer that switches to a break after",
    file: "pomodoro.tsx",
    shows: "Intervals and cleanup",
    what: "Start it. It runs, pauses, flips to a break, counts rounds.",
    app: () => <Pomodoro />,
  },
  {
    id: "habit",
    chip: "Track a habit",
    title: "Habit tracker",
    screens: 1,
    prompt: "something to track if i went to the gym this week",
    file: "habit.tsx",
    shows: "Computed streaks",
    what: "Tap any day. The streak and the progress bar both react.",
    app: () => <HabitTracker />,
  },
  {
    id: "cards",
    chip: "Flashcards",
    title: "Flashcards",
    screens: 1,
    prompt: "flashcards to revise react, tap to flip them",
    file: "cards.tsx",
    shows: "3D transforms, deck state",
    what: "Tap to flip. Mark what you knew. It tracks the deck.",
    app: () => <Flashcards />,
  },
  {
    id: "count",
    chip: "Count down",
    title: "Countdown",
    screens: 1,
    prompt: "a countdown to my exam that updates every second",
    file: "countdown.tsx",
    shows: "Live ticking clock",
    what: "Watch the seconds move. A real timer, not a picture of one.",
    app: () => <Countdown />,
  },
];

export function demoById(id: string) {
  return DEMOS.find((d) => d.id === id) ?? DEMOS[0];
}
