import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Info, CalendarDays, Rocket, BrainCircuit, Users, BookOpenCheck, Image as ImageIcon } from 'lucide-react';

// Inicialitzem l'SDK oficial de Gemini amb la clau d'entorn
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Funció per generar la SA estructurada en JSON
const generateSA = async (promptText) => {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `Ets un expert en el Decret 175/2022 de Catalunya. Genera una Situació d'Aprenentatge (SA) estructurada en format JSON sobre el tema: "${promptText}".
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
          "visualPrompt": "Detailed visual description for an educational vector infographic image representing this session, flat style, bright colors, cute characters of children, no text."
        }
      ]
    }`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  if (!response.text) {
    throw new Error("No s'ha rebut resposta del model.");
  }

  return JSON.parse(response.text);
};

// Funció per generar la imatge de la infografia amb Imagen 3
const generateInfographicImage = async (visualPrompt) => {
  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: visualPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });

  const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (base64ImageBytes) {
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }

  throw new Error("No s'ha pogut generar la imatge.");
};

function App() {
  const [prompt, setPrompt] = useState('La importància del reciclatge a 4t de primària');
  const [saData, setSaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingImages, setGeneratingImages] = useState({});

  const handleGenerate = async () => {
    setLoading(true);
    setSaData(null);
    try {
      const generatedSA = await generateSA(prompt);
      setSaData(generatedSA);
    } catch (error) {
      console.error("Error generant la SA:", error);
      alert("Error en generació. Revisa que la variable VITE_GEMINI_API_KEY a Vercel sigui correcta.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (sessionId) => {
    if (!saData) return;
    const session = saData.sessions.find(s => s.id === sessionId);
    if (!session || !session.visualPrompt) return;

    setGeneratingImages(prev => ({ ...prev, [sessionId]: true }));

    try {
      const imageUrl = await generateInfographicImage(session.visualPrompt);
      
      setSaData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          sessions: prevData.sessions.map(s => 
            s.id === sessionId ? { ...s, imageUrl: imageUrl } : s
          )
        };
      });
    } catch (error) {
      console.error(`Error generant imatge per a la sessió ${sessionId}:`, error);
      alert("Error generant la imatge de la infografia.");
    } finally {
      setGeneratingImages(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <header className="flex items-center justify-between pb-8 border-b border-slate-200 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">MestreIA Catalunya</h1>
            <p className="text-slate-600">Generador de SA amb Infografies visuals per sessions</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Rocket size={24} className="text-blue-600"/> Crea la teva SA
          </h2>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Títol o Repte de la Situació d'Aprenentatge
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-5 border border-slate-200 rounded-2xl h-40 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-slate-800"
            placeholder="Descriu breument què vols treballar..."
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-blue-700 transition disabled:bg-slate-300 flex items-center justify-center gap-2"
          >
            {loading ? 'Generant SA...' : 'Generar SA i prompts visuals'}
          </button>
        </aside>

        <main className="lg:col-span-8 space-y-10">
          {saData ? (
            <>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-2xl font-extrabold mb-4">{saData.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-5 rounded-2xl flex items-start gap-3">
                    <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                    <p><strong>Repte:</strong> {saData.repte}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl flex items-start gap-3">
                    <BookOpenCheck className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                    <p><strong>Producte Final:</strong> {saData.producteFinal}</p>
                  </div>
                </div>
              </div>

              {saData.sessions && saData.sessions.map((session) => (
                <div key={session.id} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
                        <CalendarDays size={24} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-500">Sessió {session.id}</span>
                        <h3 className="text-xl font-bold">{session.title}</h3>
                      </div>
                    </div>
                    {session.imageUrl ? (
                      <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                        <img src={session.imageUrl} alt={`Infografia Sessió ${session.id}`} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGenerateImage(session.id)}
                        disabled={generatingImages[session.id]}
                        className="bg-slate-100 text-slate-700 py-3 px-5 rounded-xl font-semibold hover:bg-slate-200 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ImageIcon size={18} />
                        {generatingImages[session.id] ? 'Generant imatge...' : 'Generar Infografia'}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <Users size={18} className="text-blue-500"/> Activitats
                    </h4>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{session.activities}</p>
                    {session.visualPrompt && (
                      <details className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <summary className="text-sm font-semibold text-slate-600 cursor-pointer">Veure descripció visual</summary>
                        <p className="text-xs text-slate-500 mt-2 p-3 bg-slate-100 rounded-lg">{session.visualPrompt}</p>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center bg-white p-20 rounded-3xl shadow-xl border border-slate-100 space-y-4">
              <BrainCircuit size={48} className="mx-auto text-blue-200" />
              <p className="text-2xl font-semibold text-slate-600">Encara no has generat cap SA.</p>
              <p className="text-slate-500">Escriu el tema a l'esquerra per generació automàtica i crear infografies per cada sessió.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
