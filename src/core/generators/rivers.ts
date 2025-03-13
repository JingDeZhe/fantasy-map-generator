import type { RiverPath, MapConfig, MapState } from './types'

export function generateRivers(state: MapState, config: MapConfig): RiverPath[] {
  const rivers: RiverPath[] = []

  for (let i = 0; i < config.RIVER_COUNT; i++) {
    const path: RiverPath = []
    let x = Math.floor(Math.random() * config.MAP_WIDTH)
    let y = Math.floor(Math.random() * config.MAP_HEIGHT)

    while (state.heightMap[y][x] > 0.3) {
      path.push([x, y])

      const neighbors = [-1, 0, 1].flatMap((dy) =>
        [-1, 0, 1].map((dx) => ({
          dx,
          dy,
          height: state.heightMap[y + dy]?.[x + dx] ?? Infinity,
        }))
      )

      const lowest = neighbors.reduce((a, b) => (a.height < b.height ? a : b))
      if (lowest.dx === 0 && lowest.dy === 0) break

      x += lowest.dx
      y += lowest.dy
    }

    path.length > 0 && rivers.push(path)
  }
  return rivers
}
