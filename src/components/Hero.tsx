import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const scrollToContacto = () => {
    const element = document.getElementById("contacto");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#6CC7FF] to-[#E9F6FF]"
    >

      {/* Content */}
      <div className="container mx-auto px-4 py-32 z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
            Recorridos Virtuales{" "}
            <span className="text-white">Profesionales</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto drop-shadow">
            Impulsa tus espacios en Venezuela: casas, museos, gimnasios y mucho
            más
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={scrollToContacto}
              className="bg-[#6CC7FF] text-white hover:bg-[#4FB2ED] hover:scale-105 transition-all duration-300 shadow-lg text-lg px-8 py-6 group"
            >
              Empieza ya
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
