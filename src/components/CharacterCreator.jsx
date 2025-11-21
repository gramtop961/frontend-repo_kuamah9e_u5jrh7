import { useState } from "react";

const api = import.meta.env.VITE_BACKEND_URL || "";

export default function CharacterCreator({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    personality: "",
    appearance: "",
    location: "",
    creator_username: "guest",
    nsfw_allowed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${api}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create character");
      const data = await res.json();
      onCreated?.(data);
      setForm({
        name: "",
        personality: "",
        appearance: "",
        location: "",
        creator_username: form.creator_username,
        nsfw_allowed: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Create a Character</h3>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
        <input className="bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" placeholder="Location" value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})} />
        <input className="md:col-span-2 bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" placeholder="Personality (e.g., witty, calm, adventurous)" value={form.personality} onChange={(e)=>setForm({...form, personality: e.target.value})} required />
        <input className="md:col-span-2 bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-700" placeholder="Appearance (hair, eyes, style)" value={form.appearance} onChange={(e)=>setForm({...form, appearance: e.target.value})} />
        <div className="flex items-center gap-2">
          <input id="nsfw" type="checkbox" checked={form.nsfw_allowed} onChange={(e)=>setForm({...form, nsfw_allowed: e.target.checked})} />
          <label htmlFor="nsfw" className="text-sm text-slate-300">Allow sensitive images (still trust-gated)</label>
        </div>
        <button disabled={loading} className="md:col-span-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition">
          {loading ? "Creating..." : "Create Character"}
        </button>
        {error && <p className="md:col-span-2 text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}
