// map.d.ts
declare module MapTypes {
  // ================= 基础类型 =================
  type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array

  type Point = [number, number]
  type Polygon = Point[]

  // ================= 网格系统 =================
  interface Cell {
    i: number
    v: number[] // 顶点索引
    c: number[] // 相邻单元格
    b?: number // 边界标记
    t: number // 地形类型
    h: number // 高度
    temp: number // 温度
    prec: number // 降水
    biome: number // 生物群系
    population: number
  }

  interface Grid {
    width: number
    height: number
    cells: {
      i: TypedArray
      v: TypedArray[]
      c: TypedArray[]
      b?: TypedArray
      t: TypedArray
      h: TypedArray
      temp: Int8Array
      prec: Uint8Array
      biome: Uint8Array
      population: Float32Array
    }
    points: Float32Array[] // 原始点坐标
    features: Feature[]
  }

  // ================= 地理特征 =================
  interface Feature {
    id: number
    type: 'ocean' | 'lake' | 'land' | 'mountain'
    group?: 'freshwater' | 'salt' | 'frozen' | 'lava'
    vertices: number[]
    border?: boolean
  }

  // ================= Voronoi图 =================
  interface VoronoiCell {
    site: Point
    halfedges: number[]
    neighbors: VoronoiCell[]
  }

  interface DelaunayTriangle {
    points: [number, number, number]
    circumradius?: number
  }

  // ================= 气候系统 =================
  interface Climate {
    equatorTemp: number
    poleTemp: number
    winds: [number, number, number, number, number, number]
    precipitation: {
      windPatterns: WindPattern[]
      rainShadowEffect: number[]
    }
  }

  type WindPattern = {
    direction: number
    strength: number
    altitudeEffect: number
  }

  // ================= 文化系统 =================
  interface Culture {
    id: number
    name: string
    origin: Point
    expansionRate: number
    color: string
    languageTraits: {
      phonemes: string[]
      syllableStructure: string
    }
  }

  // ================= 政治系统 =================
  interface State {
    id: number
    name: string
    type: 'kingdom' | 'republic' | 'tribe'
    capital: number // 首都burg id
    color: string
    borders: Polygon[]
    military: {
      armySize: number
      navalBases: number[]
    }
  }

  interface Burg {
    id: number
    name: string
    type: 'city' | 'town' | 'village'
    population: number
    position: Point
    culture: number
    religion?: number
    MFCG?: string // 外部系统关联ID
  }

  // ================= 宗教系统 =================
  interface Religion {
    id: number
    name: string
    deity: string
    traits: {
      tolerance: number
      expansion: number
    }
    holySites: number[]
  }

  // ================= 交通系统 =================
  interface Route {
    type: 'road' | 'trail' | 'sea'
    points: Point[]
    difficulty: number
    connectedBurgs: [number, number]
  }

  // ================= 军事系统 =================
  interface Army {
    position: Point
    strength: number
    movement: number
    path?: Point[]
  }

  // ================= 地图配置 =================
  interface MapConfig {
    seed: string
    size: {
      width: number
      height: number
      latitude: number
      longitude: number
    }
    terrain: {
      roughness: number
      lacunarity: number
    }
    generationOptions: {
      urbanization: number
      cultureDiversity: number
    }
  }

  // ================= 渲染系统 =================
  interface LayerConfig {
    ocean: boolean
    biome: boolean
    political: boolean
    roads: boolean
    labels: boolean
    renderMode: 'svg' | 'canvas' | 'webgl'
  }

  // ================= 3D地形 =================
  interface Terrain3D {
    vertices: Float32Array
    normals: Float32Array
    colors: Float32Array
    indices: Uint32Array
    texture?: WebGLTexture
  }
}

export type {
  MapTypes as default,
  Cell,
  Grid,
  Feature,
  VoronoiCell,
  DelaunayTriangle,
  Climate,
  Culture,
  State,
  Burg,
  Religion,
  Route,
  Army,
  MapConfig,
  LayerConfig,
  Terrain3D,
}
