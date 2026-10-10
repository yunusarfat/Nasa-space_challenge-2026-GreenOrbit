// Rule-based demo scoring. Crop numbers are rough, illustrative values
// (in the spirit of FAO EcoCrop ranges), NOT agronomic advice.
const SEASONS = {
  kharif: [6, 7, 8, 9, 10], // monsoon
  rabi: [11, 12, 1, 2, 3], // cool/dry
  summer: [3, 4, 5, 6], // hot pre-monsoon
}

export const CROPS = {
  Rice: { season: 'kharif', tmin: 22, tmax: 33, water: 900, profit: 3, soil: -1, icon: '🌾' },
  Jute: { season: 'kharif', tmin: 24, tmax: 35, water: 800, profit: 2, soil: 0, icon: '🪢' },
  Wheat: { season: 'rabi', tmin: 12, tmax: 24, water: 350, profit: 3, soil: -1, icon: '🌿' },
  Mustard: { season: 'rabi', tmin: 12, tmax: 26, water: 250, profit: 3, soil: 0, icon: '🌼' },
  Lentil: { season: 'rabi', tmin: 12, tmax: 26, water: 250, profit: 2, soil: 2, icon: '🫘' },
  Potato: { season: 'rabi', tmin: 12, tmax: 22, water: 450, profit: 4, soil: -1, icon: '🥔' },
  'Mung bean': { season: 'summer', tmin: 24, tmax: 36, water: 350, profit: 2, soil: 2, icon: '🌱' },
  Maize: { season: 'rabi', tmin: 16, tmax: 32, water: 550, profit: 4, soil: -1, icon: '🌽' },
}

export const ROTATIONS = [
  ['Rice', 'Wheat', 'Mung bean'],
  ['Rice', 'Mustard', 'Mung bean'],
  ['Rice', 'Potato', 'Lentil'],
  ['Jute', 'Wheat', 'Mung bean'],
  ['Rice', 'Maize'],
  ['Jute', 'Lentil', 'Mung bean'],
]

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))

function seasonStats(clim, season) {
  const ms = clim.filter((c) => SEASONS[season].includes(c.month))
  return {
    temp: ms.reduce((a, c) => a + c.temp, 0) / ms.length,
    rain: ms.reduce((a, c) => a + c.rain, 0),
  }
}

function cropFit(name, clim, warming = 0) {
  const c = CROPS[name]
  const s = seasonStats(clim, c.season)
  const t = s.temp + warming
  const outside = t < c.tmin ? c.tmin - t : t > c.tmax ? t - c.tmax : 0
  const tempFit = clamp(1 - outside / 8)
  // rainfall covers part of the water need, irrigation covers the rest
  const covered = clamp(s.rain / c.water)
  const waterFit = 0.35 + 0.65 * covered
  return { fit: tempFit * 0.65 + waterFit * 0.35, tempFit, covered }
}

/**
 * weights: { water, profit, soil } each 0..100 (farmer priorities)
 * warming: extra degC to stress-test a hotter future
 */
export function scoreRotations(clim, weights, warming = 0) {
  const tw = weights.water + weights.profit + weights.soil || 1
  return ROTATIONS.map((crops) => {
    const parts = crops.map((n) => cropFit(n, clim, warming))
    const climate = parts.reduce((a, p) => a + p.fit, 0) / parts.length
    const waterSaving = 1 - clamp(crops.reduce((a, n) => a + CROPS[n].water, 0) / (crops.length * 1000))
    const profit = crops.reduce((a, n) => a + CROPS[n].profit, 0) / (crops.length * 4)
    const soil = clamp((crops.reduce((a, n) => a + CROPS[n].soil, 0) / crops.length + 1) / 3)
    const priority =
      (weights.water * waterSaving + weights.profit * profit + weights.soil * soil) / tw
    const score = Math.round((climate * 0.5 + priority * 0.5) * 100)
    return {
      crops,
      score,
      climate: Math.round(climate * 100),
      water: Math.round(waterSaving * 100),
      profit: Math.round(profit * 100),
      soil: Math.round(soil * 100),
    }
  }).sort((a, b) => b.score - a.score)
}
