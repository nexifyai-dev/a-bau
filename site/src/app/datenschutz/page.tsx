import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Datenschutz – A-Bau",
  description: "Datenschutzerklärung der Website a-bau.nexifyai.cloud – Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
  robots: { index: false, follow: false },
};

export default function Datenschutz() {
  const raw = fs.readFileSync(path.join(process.cwd(), "..", "content", "datenschutz.md"), "utf8");
  return (
    <section className="section">
      <div className="container prose" style={{ maxWidth: 840 }}>
        <ReactMarkdown>{raw}</ReactMarkdown>
      </div>
    </section>
  );
}
