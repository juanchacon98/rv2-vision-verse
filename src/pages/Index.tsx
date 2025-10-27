import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Tours from "@/components/Tours";
import About from "@/components/About";
import Map from "@/components/Map";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Tours />
      <About />
      <Map />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
