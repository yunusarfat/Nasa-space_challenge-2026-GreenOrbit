import { useEffect, useMemo, useState } from 'react'
import MapPicker from './components/MapPicker'
import ClimatePanel from './components/ClimatePanel'
import RotationPanel from './components/RotationPanel'
import { fetchPower, summarize } from './lib/power'

const PRESETS = [
  { name: 'Chattogram', lat: 22.36, lon: 91.78 },
  { name: 'Dhaka', lat: 23.81, lon: 90.41 },
  { name: 'Rajshahi', lat: 24.37, lon: 88.6 },
  { name: 'Khulna', lat: 22.82, lon: 89.55 },
  { name: 'Sylhet', lat: 24.9, lon: 91.87 },
]

export default function App() {
  const [loc, setLoc] = useState({ ...PRESETS[0] })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setError('')
    fetchPower(loc.lat, loc.lon, 2015, 2024, ctrl.signal)
      .then((r) => { setRows(r); setLoading(false) })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setError(e.message || 'Could not load NASA data')
        setLoading(false)
      })
    return () => ctrl.abort()
  }, [loc.lat, loc.lon])

  const summary = useMemo(() => (rows.length ? summarize(rows) : null), [rows])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#0f2a1f_0%,#060d0a_60%)]">
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-300/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> NASA Space Apps 2026
        </div>
        <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">
          Field <span className="bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">Shift</span>
        </h1>
        <p className="mt-2 max-w-2xl text-emerald-100/70">
          Pick a farm on the map. We pull real NASA POWER climate data and rank crop rotations for it.
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 pb-16">
        <section className="grid gap-5 lg:grid-cols-5">
          <div className="glass overflow-hidden p-2 lg:col-span-3">
            <MapPicker loc={loc} onPick={(lat, lon) => setLoc({ name: 'Custom pin', lat, lon })} />
          </div>
          <div className="glass flex flex-col gap-4 p-5 lg:col-span-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald-200/60">Selected location</div>
              <div className="mt-1 text-2xl font-bold">{loc.name}</div>
              <div className="font-mono text-sm text-white/50">{loc.lat.toFixed(3)}, {loc.lon.toFixed(3)}</div>
            </div>
            <div>
              <div className="mb-2 text-xs text-white/50">Quick picks (or click anywhere on the map)</div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p.name} onClick={() => setLoc({ ...p })}
                    className={`rounded-full border px-3 py-1 text-sm transition ${loc.name === p.name
                      ? 'border-amber-300 bg-amber-300/20 text-amber-200'
                      : 'border-white/15 text-white/70 hover:border-emerald-300/60'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-auto rounded-xl bg-emerald-400/5 p-3 text-xs text-emerald-100/60">
              <b className="text-emerald-300">Data source:</b> NASA POWER (T2M, PRECTOTCORR, ALLSKY_SFC_SW_DWN),
              monthly, 2015 to 2024. Free API, no key.
            </div>
          </div>
        </section>

        {loading && (
          <div className="glass flex items-center justify-center gap-3 p-10 text-emerald-200">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-transparent" />
            Fetching satellite and model data from NASA...
          </div>
        )}

        {error && !loading && (
          <div className="glass border-red-400/40 p-6 text-red-200">
            {error}. NASA POWER can be slow; try another location or retry.
          </div>
        )}

        {summary && !loading && !error && (
          <>
            <ClimatePanel rows={rows} s={summary} />
            <RotationPanel clim={summary.clim} />
          </>
        )}

        <footer className="pt-6 text-center text-xs text-white/30">
          Field Shift demo: regional-scale NASA data, not field-level precision.
        </footer>
      </main>
    </div>
  )
}
