import { GUI } from 'lil-gui'
import * as PIXI from 'pixi.js'
import type { MapConfig, MapState } from './generators/types'
import { generateHeightMap } from './generators/terrains'
import { generateRivers } from './generators/rivers'
import { generateCities } from './generators/cities'
import { MapRenderer } from './generators/renderer'

const config: MapConfig = {
  NOISE_SCALE: 50,
  NOISE_OCTAVES: 4,
  RIVER_COUNT: 5,
  CITY_COUNT: 10,
  CELL_SIZE: 8,
  MAP_WIDTH: 100,
  MAP_HEIGHT: 100,
}

export class MapController {
  private state!: MapState
  private renderer!: MapRenderer
  private gui!: GUI
  private app!: PIXI.Application

  constructor(el: HTMLElement) {
    this.init(el)
  }

  private async init(el: HTMLElement) {
    const app = new PIXI.Application()
    await app.init({ backgroundColor: 0xf2f2f2, resizeTo: el })
    app.stage.sortableChildren = true
    el.appendChild(app.canvas)
    this.app = app

    this.renderer = new MapRenderer(app)
    this.gui = new GUI()
    this.initGUI()
    this.generateNewMap()
  }

  private async generateNewMap() {
    this.state = {
      heightMap: generateHeightMap(config),
      rivers: [],
      cities: [],
    }
    this.state.rivers = generateRivers(this.state, config)
    this.state.cities = generateCities(this.state, config)

    this.renderer.updateTerrain(this.state, config)
    this.renderer.updateRivers(this.state.rivers, config)
    this.renderer.updateCities(this.state.cities, config)
  }

  private initGUI() {
    this.gui.add(config, 'NOISE_SCALE', 10, 100).onChange(() => this.generateNewMap())
    this.gui
      .add(config, 'NOISE_OCTAVES', 1, 8)
      .step(1)
      .onChange(() => this.generateNewMap())
    this.gui.add(config, 'RIVER_COUNT', 1, 20).onChange(() => this.generateNewMap())
    this.gui.add(config, 'CITY_COUNT', 1, 20).onChange(() => this.generateNewMap())
  }
}
