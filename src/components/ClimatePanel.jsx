import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts'

function Stat({ label, value, unit, sub, color }) {
  return (
    <div className="glass p-4 fade-up">
      <div className="text-xs uppercase tracking-widest text-emerald-200/60">{label}</div>
      <div className="mt-1 text-3xl font-bold" style={{ color }}>
        {value}
        <span className="ml-1 text-base font-medium text-white/50">{unit}</span>
      </div>
      <div className="mt-1 text-xs text-white/50">{sub}</div>
    </div>
  )
}

const tip = {
  contentStyle: { background: '#0b1a14', border: '1px solid #1f3b30', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#9fd8b8' },
}

export default function ClimatePanel({ rows, s }) {
  const sign = (v) => (v > 0 ? '+' : '')
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Avg temperature" value={s.avgTemp.toFixed(1)} unit="°C" color="#f2b134"
          sub={`${sign(s.tempTrend)}${s.tempTrend.toFixed(2)} °C per decade`} />
        <Stat label="Annual rainfall" value={Math.round(s.avgRain)} unit="mm" color="#5cc0f5"
          sub={`${sign(s.rainTrend)}${Math.round(s.rainTrend)} mm per decade`} />
        <Stat label="Solar radiation" value={s.avgSolar.toFixed(1)} unit="kWh/m²/d" color="#ff8a5c"
          sub="All-sky surface shortwave" />
        <Stat label="Data window" value={rows.length} unit="months" color="#7ddba0"
          sub={`${rows[0]?.label} to ${rows[rows.length - 1]?.label}`} />
      </div>

      <div className="glass p-4">
        <div className="mb-2 text-sm font-semibold text-emerald-100">Monthly temperature (°C)</div>
        <div className="h-52">
          <ResponsiveContainer>
            <AreaChart data={rows}>
              <defs>
                <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f2b134" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#f2b134" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#7fa593', fontSize: 10 }} minTickGap={40} />
              <YAxis tick={{ fill: '#7fa593', fontSize: 10 }} domain={['auto', 'auto']} width={30} />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="temp" stroke="#f2b134" fill="url(#gt)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-4">
        <div className="mb-2 text-sm font-semibold text-emerald-100">Annual rainfall (mm)</div>
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={s.annual}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#7fa593', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7fa593', fontSize: 10 }} width={36} />
              <Tooltip {...tip} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="rain" fill="#5cc0f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
