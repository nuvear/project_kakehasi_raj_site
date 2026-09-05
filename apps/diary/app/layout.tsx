import type { Metadata } from "next";
import "./style.css";
export const metadata: Metadata = {
  title: "AI Leadership Diary | Rajkumar Rajagobalan",
  description:
    "A twelve-week journey from AI curiosity to responsible, board-ready leadership.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
