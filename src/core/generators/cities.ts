import type { MapState, MapConfig, City } from './types'

export function generateCities(state: MapState, config: MapConfig): City[] {
  const candidates: City[] = []

  for (let y = 0; y < config.MAP_HEIGHT; y++) {
    for (let x = 0; x < config.MAP_WIDTH; x++) {
      if (state.heightMap[y][x] > 0.5 && state.heightMap[y][x] < 0.8) {
        candidates.push({ x, y })
      }
    }
  }

  return Array.from(
    { length: config.CITY_COUNT },
    () => candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0]
  ).filter(Boolean)
}
