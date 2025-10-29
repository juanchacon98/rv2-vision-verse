import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Tours from "@/components/Tours";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Map from "@/components/Map";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ContactOptions from "@/components/ContactOptions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Tours />
      <Process />
      <Pricing />
      <Map />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ContactOptions />
    </div>
  );
};

export default Index;
