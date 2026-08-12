import type { Metadata } from "next";
import KontaktClient from "./KontaktClient";
import { KONTAKT } from "@/lib/kontakt";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/kontakt/", languages: { de: `${SITE_URL}/kontakt/`, "x-default": `${SITE_URL}/kontakt/` } },
  title: { absolute: "Kontakt – A-Bau Meisterbetrieb Mönchengladbach" },
  description:
    `Kontakt zur ${KONTAKT.firma}: ${KONTAKT.strasse}, ${KONTAKT.plz} ${KONTAKT.ort}. Tel ${KONTAKT.tel}, ${KONTAKT.email}. Angebot anfragen.`,
};

export default function KontaktPage() {
  // B.21: ContactPage + LocalBusiness (NAP ausschließlich aus KONTAKT-Datenquelle — C.8, kein Hardcode)
  return (
    <>
      <KontaktClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["ContactPage", "LocalBusiness"],
            name: KONTAKT.firma,
            telephone: KONTAKT.tel,
            email: KONTAKT.email,
            url: `${SITE_URL}/kontakt/`,
            address: {
              "@type": "PostalAddress",
              streetAddress: KONTAKT.strasse,
              postalCode: KONTAKT.plz,
              addressLocality: KONTAKT.ort,
              addressCountry: "DE",
            },
          }),
        }}
      />
    </>
  );
}
