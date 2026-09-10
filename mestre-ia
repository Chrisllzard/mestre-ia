import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles, BookOpen, Layers, Eye, Download, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('generator');
  const [loading, setLoading] = useState(false);
  const [showInfografia, setShowInfografia] = useState(null);

  // Formulari simple per al mestre
  const [formData, setFormData] = useState({
    curs: '5è de Primària',
    materia: 'Coneixement del Medi Natural',
    idea: 'Projecte sobre l\'estalvi d\'aigua i la sostenibilitat a l\'escola',
    sessions: 4
  });

  // Resultat generat per la IA
  const [generatedSA, setGeneratedSA] = useState(null);

  // Crida real a l'API de Google Gemini (Decret 175/2022 de Catalunya)
  const handleGenerateAI = async () => {
    const cleanKey = apiKey ? apiKey.trim() : '';

    if (!cleanKey) {
      alert("Si us plau, enganxa la teva clau d'API de Gemini a la part superior.");
      return;
    }

    setLoading(true);

    const promptText = `
Ets un expert pedagògic del currículum de Catalunya (Decret 175/2022).
Genera una Situació d'Aprenentatge (SA) per a:
- Curs: ${formData.curs}
- Àrea: ${formData.materia}
- Idea: ${formData.idea}
- Sessions: ${formData.sessions}

Respon ÚNICAMENT amb un objecte JSON vàlid sense cap text ni etiquetes Markdown abans o després.
Format del JSON:
{
  "titol": "Títol de la SA",
  "reptes": "Repte o pregunta guia",
  "curriculum": {
    "competenciesEspecifiques": ["Competència 1", "Competència 2"],
    "criterisAvaluacio": ["Criteri 1.1", "Criteri 2.1"],
    "sabersBasics": ["Saber 1", "Saber 2"]
  },
  "dua": {
    "representacio": "Mesura visual/auditiva",
    "accioExpressio": "Opcions de resposta",
    "implicacio": "Forma de motivar"
  },
  "sessions": [
    {
      "num": 1,
      "titol": "Títol de la sessió 1",
      "desc": "Què es fa a l'aula",
      "objectiu": "Objectiu clau",
      "data": "15 Set"
    }
  ]
}
`;

    try {
      // Petició utilitzant el model actualitzat
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${cleanKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );

      const data = await response.json();

      // Si Google retorna un error de clau o permis, el mostrem clarament
      if (data.error) {
        alert(`Error de Google Gemini (${data.error.code}): ${data.error.message}`);
        setLoading(false);
        return;
      }

      const rawText = data.candidates[0].content.parts[0].text;
      const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedSA = JSON.parse(cleanedJson);

      setGeneratedSA(parsedSA);
      setActiveTab('sa-view');
    } catch (error) {
      console.error("Error generant la SA:", error);
      alert("Error en processar la resposta de la IA. Torna a intentar-ho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Capçalera */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-pink-500 p-2.5 rounded-2xl text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                MestreIA Catalunya
              </h1>
              <p className="text-xs text-slate-500">Decret 175/2022 • Calendari & SA Intel·ligents</p>
            </div>
          </div>

          {/* Menú de navegació */}
          <nav className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'generator' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✨ Crear SA
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Calendari de Curs
            </button>
            {generatedSA && (
              <button
                onClick={() => setActiveTab('sa-view')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'sa-view' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📖 SA Generada
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Camp per introduir la clau d'API de forma segura */}
      <div className="bg-indigo-900 text-white py-3 px-6 text-center text-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-center space-x-2">
          <span>🔑 Enganxa aquí la teva Clau d'API de Gemini:</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AQ.Ab8RN6..."
            className="bg-indigo-800 text-white placeholder-indigo-300 px-3 py-1 rounded-lg border border-indigo-700 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 w-64"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 1. CREACIÓ DE LA SA SENSE DESPLEGABLES */}
        {activeTab === 'generator' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <div className="text-center mb-6">
              <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                Zero burocràcia
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Què vols dur a l'aula?</h2>
              <p className="text-slate-500 text-xs mt-1">Escriu la teva idea i la IA cercarà automàticament el currículum de Catalunya.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Curs</label>
                  <select
                    value={formData.curs}
                    onChange={(e) => setFormData({...formData, curs: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium"
                  >
                    <option>1r de Primària</option>
                    <option>2n de Primària</option>
                    <option>3r de Primària</option>
                    <option>4t de Primària</option>
                    <option>5è de Primària</option>
                    <option>6è de Primària</option>
                    <option>1r d'ESO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Àrea / Matèria</label>
                  <select
                    value={formData.materia}
                    onChange={(e) => setFormData({...formData, materia: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium"
                  >
                    <option>Coneixement del Medi Natural</option>
                    <option>Coneixement del Medi Social</option>
                    <option>Llengua Catalana i Literatura</option>
                    <option>Matemàtiques</option>
                    <option>Educació Artística</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Idea principal o repte</label>
                <textarea
                  rows="3"
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre de sessions</label>
                <input
                  type="number"
                  value={formData.sessions}
                  onChange={(e) => setFormData({...formData, sessions: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs"
                />
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center space-x-2 text-sm"
              >
                {loading ? (
                  <span>🤖 Consultant Decret 175/2022...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generar Situació d'Aprenentatge</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2. VISTA DE LA SA GENERADA */}
        {activeTab === 'sa-view' && generatedSA && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  {formData.curs} • {formData.materia}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{generatedSA.titol}</h2>
                <p className="text-slate-500 text-xs mt-1"><strong>Repte:</strong> {generatedSA.reptes}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Targeta Currículum CAT */}
              <div className="bg-emerald-50/60 border border-emerald-100 p-6 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <BookOpen className="h-4 w-4" />
                  <h3>Currículum Oficial (Decret 175/2022)</h3>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-emerald-900 uppercase">Competències Específiques</h4>
                  <ul className="text-xs text-emerald-900 mt-1 space-y-1.5">
                    {generatedSA.curriculum.competenciesEspecifiques.map((c, i) => (
                      <li key={i} className="bg-white p-2 rounded-xl border border-emerald-100">{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-emerald-900 uppercase">Criteris d'Avaluació</h4>
                  <ul className="text-xs text-emerald-900 mt-1 space-y-1.5">
                    {generatedSA.curriculum.criterisAvaluacio.map((c, i) => (
                      <li key={i} className="bg-white p-2 rounded-xl border border-emerald-100">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Targeta DUA */}
              <div className="bg-amber-50/60 border border-amber-100 p-6 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                  <Layers className="h-4 w-4" />
                  <h3>Mesures DUA</h3>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-amber-900 uppercase">Representació</h4>
                  <p className="text-xs text-amber-900 mt-1 bg-white p-2 rounded-xl border border-amber-100">{generatedSA.dua.representacio}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-amber-900 uppercase">Acció i Expressió</h4>
                  <p className="text-xs text-amber-900 mt-1 bg-white p-2 rounded-xl border border-amber-100">{generatedSA.dua.accioExpressio}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-amber-900 uppercase">Implicació</h4>
                  <p className="text-xs text-amber-900 mt-1 bg-white p-2 rounded-xl border border-amber-100">{generatedSA.dua.implicacio}</p>
                </div>
              </div>

              {/* Targeta Sessions i Infografia */}
              <div className="bg-indigo-50/60 border border-indigo-100 p-6 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <h3>Seqüència de Sessions</h3>
                </div>
                <div className="space-y-2">
                  {generatedSA.sessions.map((s) => (
                    <div key={s.num} className="bg-white p-3 rounded-2xl border border-indigo-100">
                      <div className="flex justify-between items-center">
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">S{s.num}</span>
                        <button
                          onClick={() => setShowInfografia(s)}
                          className="text-[10px] bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold px-2 py-1 rounded-md flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Infografia Aula</span>
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">{s.titol}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CALENDARI */}
        {activeTab === 'calendar' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Calendari de Sessions de Curs</h2>
            <p className="text-xs text-slate-500">Les sessions creades amb la IA es posicionen automàticament en els teus dies de classe.</p>
          </div>
        )}
      </main>

      {/* POPUP D'INFOGRAFIA PER A L'AULA */}
      {showInfografia && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full border-4 border-indigo-500 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Sessió {showInfografia.num} • Projecte Aula
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{showInfografia.titol}</h3>
              </div>
              <button
                onClick={() => setShowInfografia(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs"
              >
                ✕ Tancar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-900 uppercase">🎯 Què farem avui?</h4>
                <p className="text-xs text-indigo-800 mt-1">{showInfografia.desc}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-900 uppercase">⭐ Objectiu de la classe</h4>
                <p className="text-xs text-emerald-800 mt-1">{showInfografia.objectiu || "Aprendre i col·laborar en equip."}</p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition-all"
            >
              🖨️ Imprimir o Projectar a la PDI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
