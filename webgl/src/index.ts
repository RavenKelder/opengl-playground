import { Renderer } from "./webgl/render";
import config from "./config";
import { generate } from "./model/generator";
import { Camera } from "./webgl/camera";
import { Movement } from "./controller/movement";

const { page } = config;

var camera: Camera = new Camera();

function main() {
  const canvasContainer = document.getElementById(page.CANVAS_CONTAINER_ID);
  const canvas = canvasElement(document.getElementById(page.CANVAS_ID));
  const controller = new Controller();

  const vectorArray = generate(controller, 100000, 1, 1000);

  if (canvas && canvasContainer) {
    camera = new Camera({
      perspective: {
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
      },
    });

    const renderer = new Renderer(canvas, camera, 60, vectorArray);
    const movement = new Movement(canvasContainer, camera, 100);

    controller.addEventListener("start", () => {
      renderer.start();
      movement.start();
    });

    controller.addEventListener("stop", () => {
      renderer.stop();
      movement.stop();
    });
  } else {
    alert("Cannot find canvas.");
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
