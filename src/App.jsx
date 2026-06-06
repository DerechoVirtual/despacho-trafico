import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TrustBar from "./components/TrustBar.jsx";
import Services from "./components/Services.jsx";
import InfractionTypes from "./components/InfractionTypes.jsx";
import Process from "./components/Process.jsx";
import SocialProof from "./components/SocialProof.jsx";
import About from "./components/About.jsx";
import FAQ from "./components/FAQ.jsx";
import CTASection from "./components/CTASection.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <InfractionTypes />
        <Process />
        <SocialProof />
        <About />
        <FAQ />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
