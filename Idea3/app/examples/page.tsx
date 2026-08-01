import type { Metadata } from "next";
import Examples from "./Examples";

export const metadata: Metadata = {
  title: "Examples: apps built on a phone",
  description:
    "Six working apps, each described in one sentence. Open any of them and use it.",
};

export default function Page() {
  return <Examples />;
}
