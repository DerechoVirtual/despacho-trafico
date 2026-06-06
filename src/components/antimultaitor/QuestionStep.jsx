import { useRef, useState } from "react";
import { comprimirImagen } from "../../lib/antimultaitor.js";

/* Renderiza el input de una pregunta según su tipo. */
export default function QuestionStep({ q, value, onChange, foto, setFoto, onAutoAdvance }) {
  if (q.tipo === "single") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {q.opciones.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                onAutoAdvance && onAutoAdvance();
              }}
              className={`am-option am-glass flex items-start gap-3 rounded-2xl p-4 text-left ${
                active ? "am-option-active" : ""
              }`}
            >
              <span className="text-2xl leading-none">{o.emoji}</span>
              <span className="min-w-0">
                <span className="block font-semibold text-white">{o.label}</span>
                {o.desc ? (
                  <span className="mt-0.5 block text-sm text-indigo-200/55">{o.desc}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (q.tipo === "multi") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (o) => {
      if (o.soltero) {
        onChange(arr.includes(o.value) ? [] : [o.value]);
        return;
      }
      const sinSolteros = arr.filter(
        (x) => !q.opciones.find((op) => op.value === x)?.soltero
      );
      onChange(
        sinSolteros.includes(o.value)
          ? sinSolteros.filter((x) => x !== o.value)
          : [...sinSolteros, o.value]
      );
    };
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {q.opciones.map((o) => {
          const active = arr.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o)}
              className={`am-option am-glass flex items-center gap-3 rounded-2xl p-4 text-left ${
                active ? "am-option-active" : ""
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-sm font-bold ${
                  active ? "am-ring border-transparent text-white" : "border-indigo-300/30 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="text-xl leading-none">{o.emoji}</span>
              <span className="font-medium text-white">{o.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (q.tipo === "fechas") {
    const v = value || {};
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {q.campos.map((c) => (
          <label key={c.id} className="block">
            <span className="mb-1.5 block text-sm text-indigo-200/70">{c.label}</span>
            <input
              type="date"
              className="am-input am-mono w-full rounded-xl px-4 py-3"
              value={v[c.id] || ""}
              onChange={(e) => onChange({ ...v, [c.id]: e.target.value })}
            />
          </label>
        ))}
      </div>
    );
  }

  if (q.tipo === "textarea") {
    const len = (value || "").length;
    return (
      <div>
        <textarea
          rows={6}
          maxLength={q.maxLength || 1200}
          placeholder={q.placeholder}
          className="am-input w-full resize-none rounded-2xl px-4 py-3.5 leading-relaxed"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="mt-1.5 text-right text-xs text-indigo-200/40">
          {len}/{q.maxLength || 1200}
        </p>
      </div>
    );
  }

  if (q.tipo === "foto") {
    return <FotoUploader foto={foto} setFoto={setFoto} />;
  }

  return null;
}

function FotoUploader({ foto, setFoto }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Sube una imagen (JPG o PNG). Si tienes un PDF, hazle una captura.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const c = await comprimirImagen(file);
      setFoto({ ...c, name: file.name });
    } catch (e) {
      setErr(e.message || "No se pudo procesar la imagen.");
    } finally {
      setBusy(false);
    }
  }

  if (foto) {
    return (
      <div className="am-glass flex flex-col items-center gap-4 rounded-2xl p-5 sm:flex-row">
        <img
          src={foto.dataUrl}
          alt="Boletín subido"
          className="h-32 w-full rounded-xl object-cover sm:w-44"
        />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="flex items-center justify-center gap-2 font-semibold text-emerald-300 sm:justify-start">
            <span>✓</span> Documento cargado
          </p>
          <p className="mt-1 truncate text-sm text-indigo-200/60">
            {foto.name} · {foto.peso} KB
          </p>
          <button
            type="button"
            onClick={() => setFoto(null)}
            className="mt-3 rounded-full border border-rose-300/30 px-4 py-1.5 text-sm font-medium text-rose-200 transition hover:bg-rose-400/10"
          >
            Quitar y subir otra
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`am-glass flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-dashed px-6 py-12 text-center transition ${
          drag ? "am-option-active" : ""
        }`}
        style={{ borderStyle: "dashed", borderWidth: 1.5 }}
      >
        {busy ? (
          <>
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300/40 border-t-cyan-300" />
            <span className="text-sm text-indigo-200/70">Optimizando la imagen…</span>
          </>
        ) : (
          <>
            <span className="text-4xl">📸</span>
            <span className="font-semibold text-white">Arrastra aquí tu boletín o haz clic</span>
            <span className="text-sm text-indigo-200/55">
              JPG o PNG · una foto nítida del documento basta
            </span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {err ? <p className="mt-3 text-sm font-medium text-rose-300">{err}</p> : null}
      <p className="mt-3 flex items-center gap-2 text-xs text-indigo-200/45">
        <span>🔒</span> La imagen solo se usa para el análisis. No se publica en ningún sitio.
      </p>
    </div>
  );
}
