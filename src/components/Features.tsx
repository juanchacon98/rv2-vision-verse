import { Card, CardContent } from "@/components/ui/card";
import { Building2, Zap } from "lucide-react";

const Features = () => {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Destaca tus propiedades
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ofrece visitas 360° a potenciales clientes sin salir de casa
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <Card className="group hover:shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Building2 size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Más que casas
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Creamos recorridos virtuales para museos, hoteles, oficinas,
                    gimnasios, restaurantes y cualquier espacio que quieras
                    mostrar de forma profesional e inmersiva.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="group hover:shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card animate-fade-in [animation-delay:200ms]">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Zap size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Calidad y simplicidad
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Compatibilidad total con dispositivos móviles, carga rápida
                    y navegación intuitiva. Tus clientes disfrutarán de una
                    experiencia fluida desde cualquier lugar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
