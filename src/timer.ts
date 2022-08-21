export class Timer {
  private id: string;
  private t0: number;
  private dt: number[];

  constructor(id: string) {
    this.id = id;
    this.dt = [];
    this.t0 = Date.now();
  }

  start(): void {
    this.t0 = Date.now();
  }

  end(): void {
    this.dt.push(Date.now() - this.t0);
  }

  toString(): string {
    let res = `${this.id} [${this.dt}]ms`;
    const n = this.dt.length;
    if (n > 1) {
      const min = Math.min(...this.dt);
      const max = Math.max(...this.dt);
      const sum = this.dt.reduce((s, c) => s + c, 0);
      res += ` n=${n} sum=${sum} mean=${sum/n|0} min=${min} max=${max}`;
    }
    return res;
  }
}