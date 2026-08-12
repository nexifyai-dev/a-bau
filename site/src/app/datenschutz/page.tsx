import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz – A-Bau",
  description: "Datenschutzerklärung der Website a-bau.nexifyai.cloud – Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
  alternates: { canonical: "/datenschutz/", languages: { de: `${SITE_URL}/datenschutz/`, "x-default": `${SITE_URL}/datenschutz/` } },
  robots: { index: false, follow: false },
};

export default function Datenschutz() {
  const raw = fs.readFileSync(path.join(process.cwd(), "..", "content", "datenschutz.md"), "utf8");
  return (
    <section className="section">
      <div className="container prose">
        <ReactMarkdown>{raw}</ReactMarkdown>
      </div>
    </section>
  );
}
