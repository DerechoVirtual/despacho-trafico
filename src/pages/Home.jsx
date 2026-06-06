import Hero from "../components/Hero.jsx";
import TrustBar from "../components/TrustBar.jsx";
import AntiMultaitorBanner from "../components/AntiMultaitorBanner.jsx";
import Services from "../components/Services.jsx";
import InfractionTypes from "../components/InfractionTypes.jsx";
import Process from "../components/Process.jsx";
import SocialProof from "../components/SocialProof.jsx";
import About from "../components/About.jsx";
import FAQ from "../components/FAQ.jsx";
import CTASection from "../components/CTASection.jsx";
import Contact from "../components/Contact.jsx";
import { useSeo } from "../lib/seo.js";

export default function Home() {
  useSeo({
    title: "Abogados de Multas de Tráfico en toda España | Rivero Abogados",
    description:
      "¿Te han multado? Estudiamos tu multa GRATIS y te decimos si tiene recurso. Especialistas en sanciones de tráfico, alcoholemia, recursos y puntos del carnet. Toda España, 100% online.",
    path: "/",
  });

  return (
    <>
      <Hero />
      <TrustBar />
      <AntiMultaitorBanner />
      <Services />
      <InfractionTypes />
      <Process />
      <SocialProof />
      <About />
      <FAQ />
      <CTASection />
      <Contact />
    </>
  );
}
