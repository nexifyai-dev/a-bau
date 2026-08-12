import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Impressum – A-Bau",
  description: "Impressum der A-Bau Meisterbetrieb GmbH, Luisental 69, 41199 Mönchengladbach.",
  alternates: { canonical: "/impressum/", languages: { de: "https://a-bau.nexifyai.cloud/impressum/", "x-default": "https://a-bau.nexifyai.cloud/impressum/" } },
  robots: { index: false, follow: false },
};

export default function Impressum() {
  const raw = fs.readFileSync(path.join(process.cwd(), "..", "content", "impressum.md"), "utf8");
  return (
    <section className="section">
      <div className="container prose">
        <ReactMarkdown>{raw}</ReactMarkdown>
      </div>
    </section>
  );
}
