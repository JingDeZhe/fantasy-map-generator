import * as PIXI from 'pixi.js'
import type { MapState, MapConfig, RiverPath, City } from './types'
import { getTerrainColor } from './terrains'

import citySvgIcon from '@/assets/imgs/city-gate-svgrepo-com.svg?raw'

export class MapRenderer {
  private app: PIXI.Application
  private terrainSprite: PIXI.Sprite
  public riversContainer: PIXI.Container
  public citiesContainer: PIXI.Container

  constructor(app: PIXI.Application) {
    this.app = app
    this.terrainSprite = new PIXI.Sprite()
    this.riversContainer = new PIXI.Container()
    this.citiesContainer = new PIXI.Container()

    this.app.stage.sortableChildren = true
    this.riversContainer.zIndex = 1
    this.citiesContainer.zIndex = 2

    app.stage.addChild(this.terrainSprite, this.riversContainer, this.citiesContainer)
  }

  public updateTerrain(state: MapState, config: MapConfig) {
    const graphics = new PIXI.Graphics()

    for (let y = 0; y < config.MAP_HEIGHT; y++) {
      for (let x = 0; x < config.MAP_WIDTH; x++) {
        graphics.fill(getTerrainColor(state.heightMap[y][x]))
        graphics.rect(x * config.CELL_SIZE, y * config.CELL_SIZE, config.CELL_SIZE, config.CELL_SIZE)
        graphics.fill()
      }
    }

    const texture = this.app.renderer.generateTexture(graphics)
    this.terrainSprite.texture = texture
    graphics.destroy()
  }

  public updateRivers(rivers: RiverPath[], config: MapConfig) {
    this.riversContainer.removeChildren()

    rivers.forEach((path) => {
      const t = new PIXI.Graphics()
        .setStrokeStyle(20)
        .setStrokeStyle(0x61afef)
        .moveTo(path[0][0] * config.CELL_SIZE, path[0][1] * config.CELL_SIZE)

      path.forEach(([x, y]) => t.lineTo(x * config.CELL_SIZE, y * config.CELL_SIZE))
      t.stroke()
      this.riversContainer.addChild(t)
    })
  }

  public updateCities(cities: City[], config: MapConfig) {
    this.citiesContainer.removeChildren()
    cities.forEach(({ x, y }) => {
      const svgContext = new PIXI.GraphicsContext().svg(citySvgIcon)
      const t = new PIXI.Graphics(svgContext)
      t.setSize(config.CELL_SIZE * 2)
      t.position.set(x * config.CELL_SIZE, y * config.CELL_SIZE)
      this.citiesContainer.addChild(t)
    })
  }
}
