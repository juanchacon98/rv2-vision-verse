import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import testimoniosData from "@/data/testimonios.json";

const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Opiniones de nuestros clientes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimoniosData.map((testimonio, index) => (
            <Card
              key={index}
              className="hover:shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8 space-y-4">
                {/* Estrellas */}
                <div className="flex gap-1">
                  {[...Array(testimonio.estrellas)].map((_, i) => (
                    <Star
                      key={i}
                      className="fill-primary text-primary"
                      size={20}
                    />
                  ))}
                </div>

                {/* Comentario */}
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonio.comentario}"
                </p>

                {/* Autor */}
                <div className="pt-4 border-t border-border">
                  <p className="font-bold text-foreground">
                    {testimonio.nombre}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
