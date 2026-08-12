import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "AGB – A-Bau Meisterbetrieb Mönchengladbach" },
  description: "Allgemeine Geschäftsbedingungen der A-Bau Meisterbetrieb GmbH für Bauleistungen, Angebote und Verträge.",
  alternates: { canonical: "/agb/", languages: { de: `${SITE_URL}/agb/`, "x-default": `${SITE_URL}/agb/` } },
};

export default function Agb() {
  const raw = fs.readFileSync(path.join(process.cwd(), "..", "content", "agb.md"), "utf8");
  return (
    <section className="section">
      <div className="container prose">
        <ReactMarkdown>{raw}</ReactMarkdown>
      </div>
    </section>
  );
}
