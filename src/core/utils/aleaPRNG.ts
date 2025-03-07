type AleaState = [number, number, number, number]
type MashFunction = (data: string) => number

interface AleaPRNG {
  (): number
  next: () => number
  uint32: () => number
  fract53: () => number
  version: string
  args: any[]
  exportState: () => AleaState
  importState: (state: AleaState) => void
}

interface AleaConstructor {
  new (...args: any[]): AleaPRNG
  importState: (state: AleaState) => AleaPRNG
}

const Mash = (): MashFunction => {
  let n = 0xefc8249d

  const mash: MashFunction = (data: string) => {
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i)
      let h = 0.02519603282416938 * n
      n = h >>> 0
      h -= n
      h *= n
      n = h >>> 0
      h -= n
      n += h * 0x100000000 // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10 // 2^-32
  }

  return mash
}

const Alea: AleaConstructor = class Alea {
  private s0: number = 0
  private s1: number = 0
  private s2: number = 0
  private c: number = 1
  public version: string = 'Alea 0.9'
  public args: any[] = []

  constructor(...args: any[]) {
    if (args.length === 0) {
      args = [Date.now()]
    }

    const mash = Mash()
    this.s0 = mash(' ')
    this.s1 = mash(' ')
    this.s2 = mash(' ')

    for (let i = 0; i < args.length; i++) {
      const value = mash(args[i])
      this.s0 -= value
      this.s1 -= value
      this.s2 -= value

      if (this.s0 < 0) this.s0 += 1
      if (this.s1 < 0) this.s1 += 1
      if (this.s2 < 0) this.s2 += 1
    }

    return this.createPRNG()
  }

  static importState(state: AleaState): AleaPRNG {
    const instance = new (Alea as any)()
    instance.importState(state)
    return instance as AleaPRNG
  }

  private createPRNG(): AleaPRNG {
    const prng = (() => this.next()) as AleaPRNG

    prng.next = () => {
      const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10
      this.s0 = this.s1
      this.s1 = this.s2
      this.s2 = t - (this.c = t | 0)
      return this.s2
    }

    prng.uint32 = () => prng() * 0x100000000
    prng.fract53 = () => prng() + ((prng() * 0x200000) | 0) * 1.1102230246251565e-16
    prng.exportState = () => [this.s0, this.s1, this.s2, this.c]
    prng.importState = (state: AleaState) => {
      ;[this.s0, this.s1, this.s2, this.c] = state
    }
    prng.version = this.version
    prng.args = this.args

    return prng
  }
} as any

// 模块导出
export default Alea

// 浏览器全局对象挂载
if (typeof window !== 'undefined') {
  ;(window as any).Alea = Alea
}
