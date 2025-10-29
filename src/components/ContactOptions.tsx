import { useState } from "react";
import { MessageCircle, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBot from "@/components/ChatBot";

const ContactOptions = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const whatsappNumber = "584143357226";
  const message = encodeURIComponent("¡Hola! Me interesa obtener más información sobre los recorridos virtuales 360°");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank");
    setIsMenuOpen(false);
  };

  const handleAIClick = () => {
    setIsMenuOpen(false);
    setIsChatOpen(true);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isMenuOpen && (
          <div className="absolute bottom-20 right-0 bg-card border border-border rounded-2xl shadow-xl p-2 min-w-[200px] animate-fade-in">
            <button
              onClick={handleAIClick}
              className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl transition-all duration-300 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">Hablar con RAI</p>
                <p className="text-xs text-muted-foreground">Asistente de IA</p>
              </div>
            </button>
            
            <div className="h-px bg-border my-2" />
            
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-3 p-3 hover:bg-green-500/10 rounded-xl transition-all duration-300 group"
            >
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Contacto directo</p>
              </div>
            </button>
          </div>
        )}

        <Button
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          {isMenuOpen ? (
            <X className="h-7 w-7 text-white" />
          ) : (
            <MessageCircle className="h-7 w-7 text-white" />
          )}
          <span className="sr-only">Opciones de contacto</span>
        </Button>

        {/* Pulse animation ring */}
        {!isMenuOpen && (
          <span className="absolute top-0 right-0 h-14 w-14 rounded-full bg-green-500 animate-ping opacity-20"></span>
        )}
      </div>

      {/* ChatBot Component */}
      {isChatOpen && <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default ContactOptions;
