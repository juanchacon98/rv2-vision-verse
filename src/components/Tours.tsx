import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import toursData from "@/data/tours.json";
import crcGymImg from "@/assets/crc-gym.png";
import civImg from "@/assets/civ-real.png";
import colabImg from "@/assets/colab-real.png";

const Tours = () => {
  const imageMap: Record<string, string> = {
    "crc-gym": crcGymImg,
    "civ": civImg,
    "casa": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "colab": colabImg,
  };

  return (
    <section id="proyectos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ejemplos de Tours Interactivos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre cómo funcionan nuestros recorridos virtuales interactivos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {toursData.map((tour, index) => (
            <Card
              key={tour.id}
              className="group overflow-hidden hover:shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={imageMap[tour.id] || tour.imagen}
                  alt={tour.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {tour.nombre}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tour.descripcion}
                </p>
                <Button
                  variant="outline"
                  className="w-full group/btn border-primary/50 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.open(tour.url, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  Abrir tour
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tours;
