import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Nutzungsbedingungen – A-Bau Meisterbetrieb Mönchengladbach" },
  description: "Nutzungsbedingungen der Website der A-Bau Meisterbetrieb GmbH: Inhalte, KI-Assistent, Haftung und Urheberrecht.",
  alternates: { canonical: "/nutzungsbedingungen/", languages: { de: `${SITE_URL}/nutzungsbedingungen/`, "x-default": `${SITE_URL}/nutzungsbedingungen/` } },
};

export default function Nutzungsbedingungen() {
  const raw = fs.readFileSync(path.join(process.cwd(), "..", "content", "nutzungsbedingungen.md"), "utf8");
  return (
    <section className="section">
      <div className="container prose">
        <ReactMarkdown>{raw}</ReactMarkdown>
      </div>
    </section>
  );
}
