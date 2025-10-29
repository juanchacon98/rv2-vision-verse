import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppFloat = () => {
  const whatsappNumber = "584127833206"; // Número de WhatsApp de RV2
  const message = encodeURIComponent("¡Hola! Me interesa obtener más información sobre los recorridos virtuales 360°");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group animate-fade-in"
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="sr-only">Contáctanos por WhatsApp</span>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-foreground text-background px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          ¡Escríbenos por WhatsApp!
        </div>
      </div>

      {/* Pulse animation ring */}
      <span className="absolute top-0 right-0 h-14 w-14 rounded-full bg-green-500 animate-ping opacity-20"></span>
    </a>
  );
};

export default WhatsAppFloat;
