export type HeightMap = number[][]
export type RiverPath = Array<[number, number]>
export type City = { x: number; y: number }

export interface MapState {
  heightMap: HeightMap
  rivers: RiverPath[]
  cities: City[]
}

export interface MapConfig {
  NOISE_SCALE: number
  NOISE_OCTAVES: number
  RIVER_COUNT: number
  CITY_COUNT: number
  CELL_SIZE: number
  MAP_WIDTH: number
  MAP_HEIGHT: number
}
