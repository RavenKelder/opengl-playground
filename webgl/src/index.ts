import { render } from "./webgl/render";
import config from "./config";
import { generate } from "./model/generator";
import { Camera } from "./webgl/camera";
import "./controller/controls";

const { page } = config;

var camera: Camera = new Camera();

function main() {
  const canvas = canvasElement(document.getElementById(page.CANVAS_ID));
  const controller = new Controller();

  const vectorArray = generate(controller, 100000, 1, 1000);

  if (canvas) {
    camera = new Camera({
      perspective: {
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
      },
    });
    render(controller, canvas, vectorArray, camera, 30);
  } else {
    alert("Cannot find canvas element.");
  }
}

function canvasElement(element: HTMLElement | null): HTMLCanvasElement | null {
  if (element instanceof HTMLCanvasElement) {
    const canvasElement = element as HTMLCanvasElement;
    return canvasElement;
  } else {
    return null;
  }
}

class Controller extends EventTarget {
  start() {
    this.dispatchEvent(new Event("start"));
  }
  stop() {
    this.dispatchEvent(new Event("stop"));
  }
}

main();

export { camera };
