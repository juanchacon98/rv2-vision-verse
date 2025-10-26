import { MapPin } from "lucide-react";
import configData from "@/data/config.json";

const Map = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            ¿Dónde trabajamos?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ofrecemos nuestros servicios en toda Venezuela, con presencia en <span className="font-semibold text-primary">Caracas</span>, Maracay, Valencia, Puerto La Cruz y San Cristóbal.
          </p>
        </div>

        {/* Mapa visual simple con ciudades */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-accent/20 rounded-2xl p-12 border-2 border-border shadow-[var(--shadow-smooth)] animate-fade-in">
            {/* Imagen de mapa de Venezuela */}
            <div className="relative h-96 flex items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Venezuela_location_map.svg/800px-Venezuela_location_map.svg.png"
                alt="Mapa de Venezuela"
                className="max-h-full w-auto opacity-40"
              />
              
              {/* Marcadores de ciudades */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {configData.mapa.ciudades.map((ciudad, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <MapPin size={20} className="text-primary" />
                      <span className="font-semibold">{ciudad.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                ¿Tu ciudad no está en la lista? Contáctanos y coordinamos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
