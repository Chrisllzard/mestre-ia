// Substitueix aquest valor per la teva API Key de Gemini
const GEMINI_API_KEY = "LA_TEVA_API_KEY_DE_GEMINI"; 

export const generateSA = async (promptText: string) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Ets un expert en el Decret 175/2022 de Catalunya. Genera una Situació d'Aprenentatge (SA) estructurada en format JSON sobre el tema: "${promptText}". 
                El JSON ha de tenir exactament aquesta estructura:
                {
                  "title": "Títol de la SA",
                  "repte": "Descripció del repte",
                  "producteFinal": "Descripció del producte final",
                  "sessions": [
                    {
                      "id": 1,
                      "title": "Títol de la sessió 1",
                      "activities": "Explicació detallada de les activitats",
                      "visualPrompt": "Detailed visual description for an educational vector infographic image representing this session, flat style, bright colors, no text."
                    }
                  ]
                }`
              }
            ]
          }
        ],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  return JSON.parse(rawText);
};

export const generateInfographicImage = async (visualPrompt: string) => {
  // Generació d'imatge mitjançant el model Imagen 3 de Google (Gratuït amb l'API Key de Gemini)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: visualPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: "image/jpeg",
          aspectRatio: "1:1"
        }
      })
    }
  );

  const data = await response.json();
  if (data.generatedImages && data.generatedImages.length > 0) {
    const base64ImageBytes = data.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }
  
  throw new Error("No s'ha pogut generar la imatge.");
};
