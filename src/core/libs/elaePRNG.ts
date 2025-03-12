type SeedValue = string | number

class AleaPRNG {
  private s0!: number
  private s1!: number
  private s2!: number
  private c!: number
  private initialArgs: SeedValue[]
  private mashVer: string = ''

  constructor(...args: SeedValue[]) {
    if (args.length === 0) {
      args = this.generateRandomSeed()
    }
    this.initialArgs = args
    this.initializeState(args)
  }

  /** 核心随机数生成方法 */
  public random(): number {
    const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10 // 2^-32
    this.s0 = this.s1
    this.s1 = this.s2
    this.c = t | 0
    this.s2 = t - this.c
    return this.s2
  }

  /** 生成53位精度的浮点数 */
  public fract53(): number {
    return this.random() + ((this.random() * 0x200000) | 0) * 1.1102230246251565e-16 // 2^-53
  }

  /** 生成32位整数 */
  public int32(): number {
    return this.random() * 0x100000000 // 2^32
  }

  /** 推进生成器周期 */
  public cycle(runs: number = 1): void {
    runs = Math.max(1, Math.floor(runs))
    for (let i = 0; i < runs; i++) {
      this.random()
    }
  }

  /** 生成指定范围的数字 */
  public range(a: number, b?: number): number {
    const [lo, hi] = this.parseRangeArgs(a, b)

    return Number.isInteger(lo) && Number.isInteger(hi)
      ? Math.floor(this.random() * (hi - lo + 1)) + lo // 整数模式
      : this.random() * (hi - lo) + lo // 浮点模式
  }

  /** 重置生成器状态 */
  public restart(): void {
    this.initializeState(this.initialArgs)
  }

  /** 重新播种 */
  public seed(...args: SeedValue[]): void {
    this.initialArgs = args
    this.initializeState(args)
  }

  /** 版本信息 */
  public version(): string {
    return 'aleaPRNG 1.1.0'
  }

  public versions(): string {
    return `${this.version()}, ${this.mashVer}`
  }

  // 私有方法
  private initializeState(seedArgs: SeedValue[]): void {
    const mash = new Mash()
    this.s0 = mash.mash(' ')
    this.s1 = mash.mash(' ')
    this.s2 = mash.mash(' ')
    this.c = 1

    for (const seed of seedArgs) {
      const seedStr = seed.toString()
      this.adjustState(seedStr, mash)
    }

    this.mashVer = mash.version
  }

  private adjustState(seed: string, mash: Mash): void {
    this.s0 -= mash.mash(seed)
    if (this.s0 < 0) this.s0 += 1

    this.s1 -= mash.mash(seed)
    if (this.s1 < 0) this.s1 += 1

    this.s2 -= mash.mash(seed)
    if (this.s2 < 0) this.s2 += 1
  }

  private generateRandomSeed(): number[] {
    if (typeof window !== 'undefined' && window.crypto) {
      const buffer = new Uint32Array(3)
      window.crypto.getRandomValues(buffer)
      return Array.from(buffer)
    }
    // 非浏览器环境的备用方案
    return [Date.now(), Math.random() * 1e16, Math.random() * 1e16]
  }

  private parseRangeArgs(a: number, b?: number): [number, number] {
    let lo: number, hi: number
    if (typeof b === 'undefined') {
      lo = 0
      hi = a
    } else {
      ;[lo, hi] = [a, b]
    }
    return [Math.min(lo, hi), Math.max(lo, hi)]
  }
}

class Mash {
  private n: number = 0xefc8249d
  public version: string = 'Mash 0.9'

  public mash(data: string): number {
    let h: number
    const str = data.toString()

    for (let i = 0; i < str.length; i++) {
      this.n += str.charCodeAt(i)
      h = 0.02519603282416938 * this.n
      this.n = h >>> 0
      h -= this.n
      h *= this.n
      this.n = h >>> 0
      h -= this.n
      this.n += h * 0x100000000 // 2^32
    }
    return (this.n >>> 0) * 2.3283064365386963e-10 // 2^-32
  }
}
