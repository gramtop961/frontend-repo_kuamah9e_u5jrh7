import { useEffect, useMemo, useState } from "react";
import Hero from "./components/Hero";
import CharacterCreator from "./components/CharacterCreator";
import ChatPanel from "./components/ChatPanel";
import Gallery from "./components/Gallery";

const api = import.meta.env.VITE_BACKEND_URL || "";

export default function App() {
  const [username, setUsername] = useState("guest");
  const [age, setAge] = useState(18);
  const [characters, setCharacters] = useState([]);
  const [current, setCurrent] = useState(null);

  // bootstrap user profile (simple demo upsert)
  useEffect(() => {
    fetch(`${api}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, age, trust_score: 0 }),
    }).catch(()=>{});
  }, [username, age]);

  const loadCharacters = async () => {
    const res = await fetch(`${api}/characters`);
    const data = await res.json();
    setCharacters(data);
    if (!current && data.length) setCurrent(data[0]);
  };

  useEffect(() => { loadCharacters(); }, []);

  const onCreated = () => { loadCharacters(); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CharacterCreator onCreated={onCreated} />
            <ChatPanel character={current} username={username} />
          </div>
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Your Profile</h3>
              <div className="space-y-3">
                <input className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" value={username} onChange={(e)=>setUsername(e.target.value)} />
                <input type="number" className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" value={age} onChange={(e)=>setAge(parseInt(e.target.value || 0))} />
              </div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Characters</h3>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {characters.map(c => (
                  <button key={c.id} onClick={()=>setCurrent(c)} className={`w-full text-left px-3 py-2 rounded-lg border ${current?.id===c.id? 'bg-blue-950/60 border-blue-700' : 'bg-slate-900 border-slate-700'} hover:bg-slate-800 transition`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium leading-tight">{c.name}</p>
                        <p className="text-xs text-slate-400 truncate">{c.personality}</p>
                      </div>
                      {c.nsfw_allowed && <span className="text-[10px] px-2 py-1 rounded bg-pink-500/20 border border-pink-400/30 text-pink-200">NSFW OK</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Gallery character={current} username={username} />
          </div>
        </section>
      </div>

      <footer className="py-10 text-center text-slate-400 text-sm">
        Built for playful character design and safe creativity.
      </footer>
    </div>
  );
}
