// NASA POWER API (free, no key): https://power.larc.nasa.gov/docs/services/api/
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export async function fetchPower(lat, lon, startYear = 2015, endYear = 2024, signal) {
  const url =
    'https://power.larc.nasa.gov/api/temporal/monthly/point' +
    `?parameters=T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN&community=AG` +
    `&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}` +
    `&start=${startYear}&end=${endYear}&format=JSON`

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`NASA POWER returned ${res.status}`)
  const json = await res.json()
  const p = json?.properties?.parameter
  if (!p) throw new Error('Unexpected response from NASA POWER')

  const rows = []
  for (const key of Object.keys(p.T2M)) {
    const month = Number(key.slice(4))
    if (month < 1 || month > 12) continue // 13 = annual mean
    const year = Number(key.slice(0, 4))
    const t = p.T2M[key]
    const r = p.PRECTOTCORR[key]
    const s = p.ALLSKY_SFC_SW_DWN[key]
    if (t === -999 || r === -999) continue
    rows.push({
      label: `${year}-${String(month).padStart(2, '0')}`,
      year,
      month,
      temp: +t.toFixed(2),
      rain: +(r * DAYS[month - 1]).toFixed(1), // mm per month
      solar: s === -999 ? null : +s.toFixed(2), // kWh/m2/day
    })
  }
  return rows.sort((a, b) => a.label.localeCompare(b.label))
}

function slope(xs, ys) {
  const n = xs.length
  if (n < 2) return 0
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  return den === 0 ? 0 : num / den
}

export function summarize(rows) {
  const years = [...new Set(rows.map((r) => r.year))]
  const annual = years.map((y) => {
    const rs = rows.filter((r) => r.year === y)
    return {
      year: y,
      temp: +(rs.reduce((a, r) => a + r.temp, 0) / rs.length).toFixed(2),
      rain: Math.round(rs.reduce((a, r) => a + r.rain, 0)),
    }
  })
  const avgTemp = annual.reduce((a, r) => a + r.temp, 0) / annual.length
  const avgRain = annual.reduce((a, r) => a + r.rain, 0) / annual.length
  const tempTrend = slope(years, annual.map((a) => a.temp)) * 10 // degC per decade
  const rainTrend = slope(years, annual.map((a) => a.rain)) * 10 // mm per decade
  const solar = rows.filter((r) => r.solar != null)
  const avgSolar = solar.reduce((a, r) => a + r.solar, 0) / (solar.length || 1)

  // mean monthly climatology, used for season-based rotation scoring
  const clim = Array.from({ length: 12 }, (_, i) => {
    const rs = rows.filter((r) => r.month === i + 1)
    return {
      month: i + 1,
      temp: rs.reduce((a, r) => a + r.temp, 0) / (rs.length || 1),
      rain: rs.reduce((a, r) => a + r.rain, 0) / (rs.length || 1),
    }
  })

  return { annual, avgTemp, avgRain, tempTrend, rainTrend, avgSolar, clim }
}
