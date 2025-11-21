import { useState } from "react";

const api = import.meta.env.VITE_BACKEND_URL || "";

export default function Gallery({ character, username }) {
  const [prompt, setPrompt] = useState("");
  const [rating, setRating] = useState("SFW");
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (e) => {
    e.preventDefault();
    if (!character) return;
    setLoading(true);
    setStatus("");
    setImg(null);
    try {
      const res = await fetch(`${api}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_id: character.id, username, prompt, rating }),
      });
      const data = await res.json();
      setStatus(`${data.status}: ${data.message}`);
      if (data.image_url) setImg(data.image_url);
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Image Generator</h3>
      <form onSubmit={generate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="md:col-span-3 bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" placeholder="Describe the scene..." value={prompt} onChange={(e)=>setPrompt(e.target.value)} required />
        <select className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" value={rating} onChange={(e)=>setRating(e.target.value)}>
          <option value="SFW">SFW</option>
          <option value="NSFW">NSFW (trust-gated)</option>
        </select>
        <button disabled={loading || !character} className="md:col-span-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition">
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>
      {status && <p className="text-sm text-slate-300 mt-2">{status}</p>}
      {img && (
        <div className="mt-4">
          <img src={img} alt="Generated" className="w-full h-auto rounded-lg border border-slate-700" />
        </div>
      )}
    </div>
  );
}
