import { Renderer } from "./webgl/render";
import config from "./config";
import { generate, generateCamera } from "./model/generator";
import { Camera } from "./webgl/camera";
import { Movement } from "./controller/movement";
import { generatorClock, physicsClock, renderClock } from "./controller/clock";
import { EngineController } from "./controller/engine";
import VectorArray from "./model/vectorArray";

const { page } = config;

function main() {
  const canvasContainer = document.getElementById(page.CANVAS_CONTAINER_ID);
  const canvas = canvasElement(document.getElementById(page.CANVAS_ID));

  const vectorArray = generate(generatorClock, 100000, 1000);

  if (canvas && canvasContainer) {
    const camera = new Camera({
      perspective: {
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
      },
    });

    // const vectorArray = generateCamera(generatorClock, camera);

    const engineController = new EngineController(canvasContainer, [
      generatorClock,
    ]);

    const renderer = new Renderer(canvas, camera, renderClock, vectorArray);
    const movement = new Movement(canvasContainer, camera, physicsClock);

    const onResize = () => {
      const width = window.innerWidth - 50;
      const height = window.innerHeight - 50;
      canvas.style.width = `${width.toString()}px`;
      canvas.style.height = `${height.toString()}px`;

      canvas.width = width;
      canvas.height = height;

      renderer.display.context.viewport(0, 0, width, height);

      camera.updatePerspective({
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
      });
    };

    window.onresize = onResize;

    window.onload = () => {
      onResize();
    };
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
