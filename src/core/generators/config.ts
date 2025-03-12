import type { MapConfig } from './types'

export const MAP_CONFIG: MapConfig = {
  MAP_WIDTH: document.documentElement.clientWidth,
  MAP_HEIGHT: document.documentElement.clientHeight,
  CELL_SIZE: 8,
  NOISE_SCALE: 50,
  NOISE_OCTAVES: 4,
  RIVER_COUNT: 5,
  CITY_COUNT: 3,
}
