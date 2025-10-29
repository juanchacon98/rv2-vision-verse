import { Card, CardContent } from "@/components/ui/card";
import { Camera, Edit, Upload, Globe } from "lucide-react";

const Process = () => {
  const steps = [
    {
      number: "01",
      icon: Camera,
      title: "Capturamos el espacio",
      description: "Visitamos tu ubicación y fotografiamos cada área con equipos profesionales 360°"
    },
    {
      number: "02",
      icon: Edit,
      title: "Editamos y conectamos",
      description: "Procesamos las imágenes y creamos puntos de navegación interactivos"
    },
    {
      number: "03",
      icon: Upload,
      title: "Subimos el recorrido",
      description: "Alojamos tu tour virtual en servidores seguros y optimizados"
    },
    {
      number: "04",
      icon: Globe,
      title: "Integración web lista",
      description: "Tu recorrido 360° está listo para compartir e integrar en tu sitio web"
    }
  ];

  return (
    <section id="proceso" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nuestro Proceso
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Cuatro pasos simples para digitalizar tu espacio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative text-center hover:shadow-[var(--shadow-strong)] transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Number badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                {step.number}
              </div>

              <CardContent className="p-8 pt-10 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
