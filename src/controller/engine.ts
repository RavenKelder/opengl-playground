import { Clock } from "./clock";

export class EngineController {
  paused: boolean = false;
  clocks: Clock[];
  constructor(element: HTMLElement, clocks: Clock[]) {
    this.clocks = clocks;
    element.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "p":
          console.log("toggle engine");
          this.toggleClocks();
          break;
      }
    });
  }

  toggleClocks() {
    if (this.paused) {
      this.clocks.forEach((c) => c.start());
      this.paused = false;
    } else {
      this.clocks.forEach((c) => c.stop());
      this.paused = true;
    }
  }
}
