import { createNoise2D } from 'simplex-noise'
import type { HeightMap, MapConfig } from './types'

export function generateHeightMap(config: MapConfig): HeightMap {
  const noise2D = createNoise2D()
  const map: HeightMap = []

  for (let y = 0; y < config.MAP_HEIGHT; y++) {
    map[y] = []
    for (let x = 0; x < config.MAP_WIDTH; x++) {
      let value = 0
      let amplitude = 1
      let frequency = 1

      for (let i = 0; i < config.NOISE_OCTAVES; i++) {
        const nx = (x / config.NOISE_SCALE) * frequency
        const ny = (y / config.NOISE_SCALE) * frequency
        value += noise2D(nx, ny) * amplitude
        amplitude *= 0.5
        frequency *= 2
      }

      map[y][x] = (value + 1) / 2
    }
  }
  return map
}

export function getTerrainColor(height: number): number {
  if (height < 0.3) return 0x2c5aa0
  if (height < 0.4) return 0x5680c1
  if (height < 0.5) return 0xe0dda0
  if (height < 0.7) return 0x7dab6d
  if (height < 0.9) return 0x555555
  return 0xffffff
}
