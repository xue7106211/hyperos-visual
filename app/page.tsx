"use client";

import dynamic from "next/dynamic";

const Panorama = dynamic(
  () => import("@/components/panorama").then((mod) => mod.Panorama),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-white" />,
  },
);

export default function Home() {
  return <Panorama />;
}
