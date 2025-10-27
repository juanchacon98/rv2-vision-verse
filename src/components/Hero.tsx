import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Virtual Tour Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-accent/70 dark:from-primary/80 dark:to-accent/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-32 z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight drop-shadow-2xl">
            Recorridos Virtuales{" "}
            <span className="text-primary-foreground">Profesionales</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/95 max-w-2xl mx-auto drop-shadow-lg">
            Impulsa tus espacios en Venezuela: casas, museos, gimnasios y mucho
            más
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={scrollToContacto}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:scale-105 transition-all duration-300 shadow-lg text-lg px-8 py-6 group"
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
