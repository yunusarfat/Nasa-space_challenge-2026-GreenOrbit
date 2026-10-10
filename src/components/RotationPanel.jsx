import { useMemo, useState } from 'react'
import { CROPS, scoreRotations } from '../lib/rotation'

function Slider({ label, value, onChange, color }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-emerald-100">{label}</span>
        <span className="text-white/50">{value}</span>
      </div>
      <input type="range" min="0" max="100" value={value} style={{ accentColor: color }}
        onChange={(e) => onChange(+e.target.value)} className="w-full" />
    </label>
  )
}

function Bar({ label, v, color }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-white/60">
      <span className="w-12">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-white/10">
        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${v}%`, background: color }} />
      </div>
      <span className="w-6 text-right">{v}</span>
    </div>
  )
}

export default function RotationPanel({ clim }) {
  const [w, setW] = useState({ water: 60, profit: 40, soil: 70 })
  const [warming, setWarming] = useState(0)
  const ranked = useMemo(() => scoreRotations(clim, w, warming), [clim, w, warming])
  const best = ranked[0]

  return (
    <div className="glass p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-emerald-50">Rotation suggestions</h2>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          ranked live from NASA POWER climate
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <Slider label="Save water" value={w.water} color="#5cc0f5" onChange={(v) => setW({ ...w, water: v })} />
        <Slider label="Profit" value={w.profit} color="#f2b134" onChange={(v) => setW({ ...w, profit: v })} />
        <Slider label="Soil health" value={w.soil} color="#7ddba0" onChange={(v) => setW({ ...w, soil: v })} />
        <label className="block">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-orange-200">Future warming</span>
            <span className="text-white/50">+{warming.toFixed(1)} °C</span>
          </div>
          <input type="range" min="0" max="4" step="0.5" value={warming} style={{ accentColor: '#ff8a5c' }}
            onChange={(e) => setWarming(+e.target.value)} className="w-full" />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {ranked.slice(0, 3).map((r, i) => (
          <div key={r.crops.join()} className={`rounded-xl border p-4 transition ${i === 0
            ? 'border-amber-300/60 bg-amber-300/10 shadow-[0_0_30px_-8px_rgba(242,177,52,0.6)]'
            : 'border-white/10 bg-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/50">
                {i === 0 ? 'Best match' : `#${i + 1}`}
              </span>
              <span className="text-2xl font-bold text-amber-300">{r.score}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1 text-sm font-semibold">
              {r.crops.map((c, j) => (
                <span key={c} className="flex items-center gap-1">
                  <span>{CROPS[c].icon} {c}</span>
                  {j < r.crops.length - 1 && <span className="text-white/30">→</span>}
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              <Bar label="Climate" v={r.climate} color="#ff8a5c" />
              <Bar label="Water" v={r.water} color="#5cc0f5" />
              <Bar label="Profit" v={r.profit} color="#f2b134" />
              <Bar label="Soil" v={r.soil} color="#7ddba0" />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/40">
        Best plan right now: <b className="text-white/70">{best.crops.join(' → ')}</b>. Drag the sliders
        or add future warming to watch the ranking change. Demo heuristic using regional (not field-level)
        climate; crop values are illustrative.
      </p>
    </div>
  )
}
