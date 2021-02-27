class Clock extends EventTarget {
  ticksPerSecond: number;
  enabled: boolean;

  constructor(ticksPerSecond: number) {
    super();
    this.ticksPerSecond = ticksPerSecond;
    this.enabled = false;
  }

  start(): boolean {
    if (this.enabled) {
      return false;
    }

    this.enabled = true;

    const tick = new Event("tick");

    (async () => {
      while (this.enabled) {
        this.dispatchEvent(tick);
        await new Promise((res) => setTimeout(res, 1000 / this.ticksPerSecond));
      }
    })();

    return true;
  }

  stop() {
    this.enabled = false;
  }
}

const clock = new Clock(100);

export { clock };
