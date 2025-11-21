import { useEffect, useRef, useState } from "react";

const api = import.meta.env.VITE_BACKEND_URL || "";

export default function ChatPanel({ character, username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!character) return;
    fetch(`${api}/chat/${character.id}/messages`).then(r=>r.json()).then(setMessages).catch(()=>{});
  }, [character?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !character) return;
    setLoading(true);
    try {
      const res = await fetch(`${api}/chat/${character.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text }),
      });
      const data = await res.json();
      setMessages(data);
      setText("");
    } finally {
      setLoading(false);
    }
  };

  if (!character) return (
    <div className="p-6 text-slate-300">Select or create a character to start chatting.</div>
  );

  return (
    <div className="flex flex-col h-[520px] bg-slate-900/60 border border-slate-800 rounded-xl">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30" />
        <div>
          <h4 className="text-white font-semibold leading-none">{character.name}</h4>
          <p className="text-xs text-slate-400">{character.personality}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600/80 text-white ml-auto' : 'bg-slate-800/80 text-slate-100'}`}>
            <p className="text-sm whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t border-slate-800 flex gap-2">
        <input
          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700"
          placeholder="Say something..."
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        <button disabled={loading} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition">Send</button>
      </form>
    </div>
  );
}
