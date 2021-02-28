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
  lastTick: Date;
  delay: number;

  constructor(ticksPerSecond: number) {
    super();
    this.ticksPerSecond = ticksPerSecond;
    this.enabled = false;
    this.delay = 1000 / ticksPerSecond;
    this.lastTick = new Date();
  }

  start(): boolean {
    if (this.enabled) {
      return false;
    }

    this.enabled = true;

    (async () => {
      while (this.enabled) {
        const now = new Date();
        const difference = now.getTime() - this.lastTick.getTime();
        this.lastTick = now;
        const tick = new ClockEvent("tick", difference);
        this.dispatchEvent(tick);

        if (difference < this.delay) {
          await new Promise((res) => setTimeout(res, this.delay - difference));
        } else {
          await new Promise((res) => setTimeout(res, 1));
        }
      }
    })();

    return true;
  }

  stop() {
    this.enabled = false;
  }
}

const physicsClock = new Clock(60);
const renderClock = new Clock(60);
const generatorClock = new Clock(100);

physicsClock.start();
generatorClock.start();
renderClock.start();

export { physicsClock, renderClock, generatorClock };
