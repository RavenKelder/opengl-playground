export class ClockEvent extends Event {
  sinceLastTick: number;

  constructor(type: string, sinceLastTick: number) {
    super(type);

    this.sinceLastTick = sinceLastTick;
  }
}

export class Clock extends EventTarget {
  ticksPerSecond: number;
  enabled: boolean;
  lastTick: number;
  lastTickTime: number;
  ticksSinceLastTickTime: number = 0;
  realTicksPerSecond: number = 0;
  lastDelay: number = 0;
  delay: number;

  constructor(ticksPerSecond: number) {
    super();
    this.ticksPerSecond = ticksPerSecond;
    this.enabled = false;
    this.delay = 1000 / ticksPerSecond;
    this.lastTick = performance.now();
    this.lastTickTime = performance.now();
  }

  updateTicksPerSecond(value: number): boolean {
    if (value <= 0 || value > 1000) {
      return false;
    }

    this.delay = 1000 / value;
    this.ticksPerSecond = value;
    return true;
  }

  start(): boolean {
    if (this.enabled) {
      return false;
    }

    this.enabled = true;

    (async () => {
      while (this.enabled) {
        const now = performance.now();
        this.lastDelay = now - this.lastTick;
        this.lastTick = now;
        const tick = new ClockEvent("tick", this.lastDelay);
        this.dispatchEvent(tick);
        this.ticksSinceLastTickTime = this.ticksSinceLastTickTime + 1;

        if (now - this.lastTickTime >= 1000) {
          this.lastTickTime = now;
          this.realTicksPerSecond = this.ticksSinceLastTickTime;
          this.ticksSinceLastTickTime = 0;
        }

        if (this.lastDelay < this.delay) {
          await new Promise((res) => setTimeout(res, this.delay));
        } else {
          await new Promise((res) => setTimeout(res, 4));
        }
      }
    })();

    return true;
  }

  stop() {
    this.enabled = false;
  }
}

const physicsClock = new Clock(50);
const renderClock = new Clock(60);
const generatorClock = new Clock(100);

physicsClock.start();
generatorClock.start();
renderClock.start();

export { physicsClock, renderClock, generatorClock };
