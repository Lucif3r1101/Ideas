export type Device = {
  id: string;
  name: string;
  short: string;
  /** real screen size in css pixels */
  w: number;
  h: number;
  /** screen corner radius */
  radius: number;
  /** pill notch, or none for older handsets */
  notch: "island" | "none";
  /** physical bezel around the screen */
  bezel: number;
};

export const DEVICES: Device[] = [
  {
    id: "se",
    name: "iPhone SE",
    short: "SE",
    w: 375,
    h: 667,
    radius: 6,
    notch: "none",
    bezel: 14,
  },
  {
    id: "15",
    name: "iPhone 15",
    short: "iPhone 15",
    w: 393,
    h: 852,
    radius: 46,
    notch: "island",
    bezel: 11,
  },
  {
    id: "max",
    name: "iPhone 15 Pro Max",
    short: "Pro Max",
    w: 430,
    h: 932,
    radius: 52,
    notch: "island",
    bezel: 11,
  },
  {
    id: "pixel",
    name: "Pixel 8",
    short: "Pixel 8",
    w: 412,
    h: 915,
    radius: 34,
    notch: "none",
    bezel: 10,
  },
];

export const DEFAULT_DEVICE = DEVICES[1];

export function deviceById(id: string) {
  return DEVICES.find((d) => d.id === id) ?? DEFAULT_DEVICE;
}
