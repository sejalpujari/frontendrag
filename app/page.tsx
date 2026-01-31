// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [chunkSize, setChunkSize] = useState(120);
  const [chunkOverlap, setChunkOverlap] = useState(30);
  const [topK, setTopK] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ragbackend-keli.onrender.com';

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAnswer('');

    try {
      const payload = {
        query,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
        top_k: topK,
      };

      const res = await fetch(`${BACKEND_URL}/rag/debug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, generate: true }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText.slice(0, 200));
      }

      const data = await res.json();
      setResult(data);
      setAnswer(data.answer?.trim() || '(no answer returned)');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection error - is backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen pb-20"
      style={{ fontFamily: "Fraunces, 'Iowan Old Style', 'Garamond', serif" }}
    >
      <div className="relative overflow-hidden bg-[radial-gradient(1200px_600px_at_80%_-10%,_#e2e8f0_0%,_transparent_60%),radial-gradient(900px_500px_at_10%_10%,_#cbd5f5_0%,_transparent_55%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_45%,_#f1f5f9_100%)]">
        <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-32 -left-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1 text-xs uppercase tracking-widest text-slate-600 shadow-sm">
              Explainable Retrieval
            </div>
            <h1 className="mt-4 text-4xl sm:text-6xl font-semibold text-slate-900 tracking-tight">
              RAG Intelligence Studio
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Observe every step in the retrieval and generation pipeline with clarity and confidence.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-slate-200/70 overflow-hidden mb-12">
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm uppercase tracking-widest text-slate-500">Query</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Ask your knowledge base</h2>
                </div>
                <div className="text-xs text-slate-500 border border-slate-200 rounded-full px-3 py-1 bg-slate-50">
                  Next.js + FastAPI
                </div>
              </div>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500 resize-y min-h-[160px] text-slate-900 placeholder:text-slate-400 transition-all duration-200 shadow-sm bg-slate-50/70 font-sans"
                rows={4}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                {[
                  { label: 'Chunk Size', value: chunkSize, set: setChunkSize, min: 50, max: 800, step: 10 },
                  { label: 'Chunk Overlap', value: chunkOverlap, set: setChunkOverlap, min: 0, max: 300, step: 5 },
                  { label: 'Display Top K', value: topK, set: setTopK, min: 1, max: 12, step: 1 },
                ].map(({ label, value, set, min, max, step }) => (
                  <div key={label} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase tracking-widest text-slate-500">{label}</label>
                      <span className="text-sm font-semibold text-slate-900">{value}</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={(e) => set(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !query.trim()}
                className={`
                  mt-8 w-full py-4 px-8 rounded-2xl font-semibold text-white text-lg
                  transition-all duration-200 shadow-lg
                  ${loading || !query.trim()
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 hover:brightness-110 active:brightness-95 hover:shadow-xl hover:-translate-y-0.5'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 font-sans">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Run RAG Pipeline ->'
                )}
              </button>

              {error && (
                <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-sans">
                  {error}
                </div>
              )}
            </div>
          </div>

          {result && (
            <div className="space-y-14">
              <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Raw Documents</h2>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Step 01</span>
                </div>
                <div className="space-y-4">
                  {Object.entries(result.documents || {}).map(([name, text]: [string, any]) => (
                    <details key={name} className="group border border-slate-200 rounded-2xl overflow-hidden">
                      <summary className="px-4 py-3 font-medium cursor-pointer list-none bg-slate-900 text-white flex items-center justify-between">
                        <span className="font-sans">{name}</span>
                        <span className="text-xs uppercase tracking-widest text-slate-300">Open</span>
                      </summary>
                      <div className="px-4 py-5 text-sm text-slate-700 whitespace-pre-wrap font-mono bg-slate-50 border-t">
                        {String(text)}
                      </div>
                    </details>
                  ))}
                  {!result.documents && <p className="text-slate-500 italic">No raw documents metadata available</p>}
                </div>
              </section>

              <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Top {topK} Retrieved Chunks</h2>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Step 02</span>
                </div>
                <div className="space-y-6">
                  {result.top_k_chunks?.map((chunk: any, i: number) => (
                    <div
                      key={i}
                      className="border border-slate-200 bg-slate-50/80 rounded-2xl p-5 transition-all hover:bg-white hover:shadow-md"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-3 mb-3 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900 font-sans">
                          Score: {chunk.score?.toFixed(4) ?? '--'}
                        </span>
                        <span className="font-mono">
                          {chunk.file} - chunk {chunk.chunk_id}
                        </span>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans leading-relaxed">
                        {chunk.text}
                      </pre>
                    </div>
                  )) || <p className="text-slate-500 italic">No chunks retrieved</p>}
                </div>
              </section>

              <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Final Context Sent to LLM</h2>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Step 03</span>
                </div>
                <pre className="bg-slate-50/90 p-5 rounded-2xl text-sm text-slate-800 overflow-x-auto max-h-105 whitespace-pre-wrap font-mono leading-relaxed border border-slate-200">
                  {result.final_context || result.top_k_chunks?.map((c: any) => c.text).join('\n\n') || '(context not returned)'}
                </pre>
              </section>

              <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Generated Answer</h2>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Step 04</span>
                </div>
                {answer ? (
                  <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed">
                    <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 whitespace-pre-wrap font-sans">
                      {answer}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No answer was generated</p>
                )}
              </section>

              <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900">Similarity Scores</h2>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Step 05</span>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {result.similarity_data?.map((item: any, i: number) => (
                    <details key={i} className="group border-b border-slate-200 pb-3 last:border-0">
                      <summary className="flex justify-between items-center cursor-pointer list-none hover:bg-slate-50/70 py-2 rounded-lg px-2">
                        <div className="flex items-center gap-4">
                          <span className={`font-semibold ${item.score > 0.4 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {item.score?.toFixed(4) ?? '--'}
                          </span>
                          <span className="text-sm text-slate-600 font-mono">
                            {item.file} - chunk {item.chunk_id}
                          </span>
                        </div>
                        <span className="text-slate-400 transition group-open:rotate-180">v</span>
                      </summary>
                      <div className="mt-3 pl-8 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {item.text}
                      </div>
                    </details>
                  )) || <p className="text-slate-500 italic">No similarity data available</p>}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
