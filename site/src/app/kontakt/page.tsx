import type { Metadata } from "next";
import KontaktClient from "./KontaktClient";

export const metadata: Metadata = {
  alternates: { canonical: "/kontakt/" },
  title: "Kontakt – A-Bau Meisterbetrieb GmbH | Mönchengladbach",
  description:
    "Kontakt zur A-Bau Meisterbetrieb GmbH: Luisental 69, 41199 Mönchengladbach. Tel +49 2166 9925056, kontakt@a-bau.info. Kostenlose Angebote.",
};

export default function KontaktPage() {
  return <KontaktClient />;
}
