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
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    console.log("Received messages:", messages.length);

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

    // Convert messages to Gemini format
    const geminiContents = [];
    
    // Add system instruction as first user message
    geminiContents.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    geminiContents.push({
      role: "model",
      parts: [{ text: "Entendido. Actuaré como asesor profesional de RV2 enfocado exclusivamente en recorridos virtuales." }]
    });
    
    // Add conversation messages
    for (const msg of messages) {
      geminiContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    console.log("Calling Gemini API with", geminiContents.length, "messages");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error al conectar con Gemini: " + errorText }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!response.body) {
      throw new Error("No response body from Gemini");
    }

    console.log("Successfully connected to Gemini API");

    // Transform Gemini SSE format to OpenAI-compatible format
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);
              
              // Extract text from Gemini response
              const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
              
              if (textContent) {
                // Convert to OpenAI format
                const openAIFormat = {
                  choices: [{
                    delta: {
                      content: textContent
                    }
                  }]
                };
                
                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`)
                );
              }
              
              // Check if done
              if (data.candidates?.[0]?.finishReason) {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              }
            } catch (e) {
              console.error("Error parsing Gemini response:", e);
            }
          }
        }
      }
    });

    return new Response(response.body.pipeThrough(transformStream), {
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
