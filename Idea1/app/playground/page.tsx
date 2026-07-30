import type { Metadata } from "next";
import Playground from "./Playground";

export const metadata: Metadata = {
  title: "Try it: Tinker playground",
  description:
    "Build a game, play it, then change the numbers and watch it change. A cut down version of what a kid gets.",
};

export default function Page() {
  return <Playground />;
}
