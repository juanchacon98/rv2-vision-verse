import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres un empleado profesional de RV2, una empresa especializada en recorridos virtuales en Venezuela. Tu único objetivo es ayudar a los clientes a entender los beneficios de los recorridos virtuales y cómo pueden impulsar sus negocios.

RESPONSABILIDADES:
- Hablar SOLO sobre recorridos virtuales y sus beneficios
- Explicar cómo RV2 puede ayudar a mejorar ventas, visibilidad y experiencia del cliente
- Mencionar que trabajamos con casas, museos, gimnasios, oficinas, espacios comerciales y más
- Ofrecer hasta un 20% de descuento para nuevos clientes
- Ser amable, profesional y entusiasta

BENEFICIOS CLAVE QUE DEBES MENCIONAR:
- Aumenta las visitas y ventas en un promedio del 30%
- Permite a los clientes explorar espacios 24/7 desde cualquier lugar
- Reduce el tiempo de decisión de compra
- Mejora la confianza del cliente al ver el espacio real
- Compatible con Google Maps y redes sociales
- Tecnología de última generación con calidad profesional

REGLAS IMPORTANTES:
- NO hables de otros temas que no sean recorridos virtuales
- NO inventes información técnica que no tengas
- Si te preguntan algo fuera del tema, redirige amablemente a recorridos virtuales
- Menciona que pueden contactar directamente desde la página para obtener una cotización
- Sé breve y conciso en tus respuestas

Actúa siempre como un asesor experto que quiere ayudar genuinamente al cliente a mejorar su negocio.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido, intenta de nuevo más tarde." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Se requiere pago, por favor agrega fondos." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error al conectar con la IA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
