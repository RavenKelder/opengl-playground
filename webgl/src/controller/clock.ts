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

    const tick = new Event("tick");

    (async () => {
      while (this.enabled) {
        this.dispatchEvent(tick);
        const now = new Date();
        const difference = now.getTime() - this.lastTick.getTime();
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
    console.log("Stopping");
    this.enabled = false;
  }
}

const physicsClock = new Clock(100);
const renderClock = new Clock(60);
const generatorClock = new Clock(100);

physicsClock.start();
generatorClock.start();
renderClock.start();

export { physicsClock, renderClock, generatorClock };
