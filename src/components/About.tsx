import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, MousePointer } from "lucide-react";

const About = () => {
  const ventajas = [
    {
      icon: Clock,
      titulo: "Tiempo y comodidad",
      descripcion:
        "Tus clientes pueden explorar tus espacios 24/7 desde cualquier lugar",
    },
    {
      icon: Shield,
      titulo: "Confianza total",
      descripcion:
        "Transparencia absoluta que genera credibilidad en tus potenciales clientes",
    },
    {
      icon: MousePointer,
      titulo: "Interactividad",
      descripcion:
        "Navegación intuitiva con puntos de interés y descripciones detalladas",
    },
  ];

  return (
    <section id="acerca" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            ¿Qué es un Recorrido Virtual 360°?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Un recorrido virtual 360° es una experiencia inmersiva que permite a
            tus clientes conocer tus espacios desde cualquier dispositivo. Es
            como estar allí, pero sin necesidad de desplazarse.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ventajas.map((ventaja, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ventaja.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {ventaja.titulo}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {ventaja.descripcion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
