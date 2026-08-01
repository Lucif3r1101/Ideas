import type { Metadata } from "next";
import Playground from "./Playground";

export const metadata: Metadata = {
  title: "Try it: Thumb playground",
  description:
    "Ask for an app, watch it get written, then use it. Works the same on a phone as on a laptop.",
};

export default function Page() {
  return <Playground />;
}
