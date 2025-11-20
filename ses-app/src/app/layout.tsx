import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "School Performance Evaluation System",
  description:
    "Upload evidence, monitor domains, and streamline school performance evaluations.",
  icons: {
    icon: "/logo.png",
  },
};

// This layout is minimal - the actual HTML structure is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}