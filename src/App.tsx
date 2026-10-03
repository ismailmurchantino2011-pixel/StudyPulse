import { useEffect, useState } from "react";
import { api } from "./lib/api";
import type { Card } from "./types";

const GRADES = [
  { q: 1, label: "Otra vez", cls: "bg-red-600" },
  { q: 3, label: "Difícil", cls: "bg-amber-600" },
  { q: 4, label: "Bien", cls: "bg-emerald-600" },
  { q: 5, label: "Fácil", cls: "bg-cyan-600" },
];

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.listCards().then(setCards).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const due = cards.filter((c) => new Date(c.dueAt) <= new Date());
  const current = due[0];

  const grade = async (q: number) => {
    if (!current) return;
    setFlipped(false);
    await api.review(current.id, q).catch((e) => setError(e.message));
    load();
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    await api.createCards([{ front, back, category: "General" }]).catch((e) => setError(e.message));
    setFront(""); setBack(""); load();
  };

  const generate = async () => {
    setBusy(true); setError("");
    try {
      const { cards: generated } = await api.generateCards(notes, 5);
      if (generated.length) await api.createCards(generated);
      setNotes(""); load();
    } catch (e) { setError((e as Error).message); }
    setBusy(false);
  };

  const input = "w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-sm focus:outline-none focus:border-indigo-500";

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">StudyPulse</h1>
        <span className="text-sm text-slate-400">{due.length} pendientes · {cards.length} fichas</span>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <section className="space-y-4">
        {current ? (
          <>
            <button onClick={() => setFlipped(!flipped)} className="w-full min-h-60 rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center text-xl font-bold">
              {flipped ? current.back : current.front}
              <div className="mt-4 text-xs font-normal text-slate-500">{flipped ? "Respuesta" : "Toca para ver la respuesta"}</div>
            </button>
            {flipped && (
              <div className="grid grid-cols-4 gap-2">
                {GRADES.map((g) => (
                  <button key={g.q} onClick={() => grade(g.q)} className={`${g.cls} rounded-xl py-3 text-sm font-bold`}>{g.label}</button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400">
            {cards.length ? "¡Has terminado los repasos de hoy!" : "Crea tu primera ficha para empezar."}
          </p>
        )}
      </section>

      <form onSubmit={add} className="space-y-2">
        <h2 className="font-bold">Nueva ficha</h2>
        <input className={input} placeholder="Pregunta" value={front} onChange={(e) => setFront(e.target.value)} />
        <textarea className={input} placeholder="Respuesta" rows={2} value={back} onChange={(e) => setBack(e.target.value)} />
        <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold">Guardar</button>
      </form>

      <section className="space-y-2">
        <h2 className="font-bold">Generar fichas con IA desde tus apuntes</h2>
        <textarea className={input} rows={4} placeholder="Pega aquí tus apuntes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button onClick={generate} disabled={busy || !notes.trim()} className="rounded-xl bg-cyan-600 disabled:bg-slate-800 px-4 py-2 text-sm font-bold">
          {busy ? "Generando..." : "Generar 5 fichas"}
        </button>
      </section>
    </main>
  );
}
