import type { Variant } from "@/app/components/GameScene";

export type Project = {
  id: Variant;
  name: string;
  tint: "sun" | "grape" | "mint";
  file: string;
  lang: string;
  ask: string;
  reply: string;
  open: string;
  close: string;
  hot: { label: string; value: string };
  note: string;
  /** the whole hero re-skins to the chosen project */
  theme: {
    skyTop: string;
    skyBot: string;
    brand: string;
    l1: string;
    l1Shadow: string;
    l2: string;
    l2Shadow: string;
    lede: string;
  };
};

export const PROJECTS: Project[] = [
  {
    id: "dog",
    name: "dog game",
    tint: "sun",
    file: "dog.js",
    lang: "JavaScript",
    ask: "make him jump when i tap",
    reply: "Done. It's line 34, try changing 14 and see what happens.",
    open: "  if (tapped) {",
    close: "  }",
    hot: { label: "    dog.jump = ", value: "14" },
    note: "she changed this",
    theme: {
      skyTop: "#7EC8FF",
      skyBot: "#D6F0FF",
      brand: "#12406B",
      l1: "#FFFFFF",
      l1Shadow: "#2F8FD6",
      l2: "#FFD84D",
      l2Shadow: "#D99F10",
      lede: "#10466F",
    },
  },
  {
    id: "rocket",
    name: "space rocks",
    tint: "grape",
    file: "rocket.py",
    lang: "Python",
    ask: "the rocks are too easy, make more",
    reply: "Bumped it to 9. What happens if you try 40?",
    open: "  def spawn():",
    close: "      return rocks",
    hot: { label: "      rocks = ", value: "9" },
    note: "she picked this",
    theme: {
      skyTop: "#2B1D5E",
      skyBot: "#6E4CB8",
      brand: "#EDE6FF",
      l1: "#FFFFFF",
      l1Shadow: "#3D2680",
      l2: "#6EE0F5",
      l2Shadow: "#2A8CA8",
      lede: "#E4D9FF",
    },
  },
  {
    id: "cat",
    name: "cat maze",
    tint: "mint",
    file: "cat.js",
    lang: "JavaScript",
    ask: "the cat should be faster than the dog",
    reply: "Set to 8. The dog is 5, see the difference?",
    open: "  onStart(() => {",
    close: "  })",
    hot: { label: "    cat.speed = ", value: "8" },
    note: "her idea",
    theme: {
      skyTop: "#FFB88C",
      skyBot: "#FFE8D2",
      brand: "#8A3D1E",
      l1: "#FFFFFF",
      l1Shadow: "#D9724A",
      l2: "#FF5C93",
      l2Shadow: "#C2386B",
      lede: "#7A3418",
    },
  },
];
