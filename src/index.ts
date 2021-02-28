import { Renderer } from "./webgl/render";
import config from "./config";
import { generate, generateCamera } from "./model/generator";
import { Camera } from "./webgl/camera";
import { Movement } from "./controller/movement";
import { generatorClock, physicsClock, renderClock } from "./controller/clock";
import { EngineController } from "./controller/engine";

const { page } = config;

/** Quite a hot mess at the moment; this function currently links the controller,
 * model and view together */
function main() {
  const canvasContainer = document.getElementById(page.CANVAS_CONTAINER_ID);
  const canvas = canvasElement(document.getElementById(page.CANVAS_ID));

  if (canvas && canvasContainer) {
    const camera = new Camera({
      perspective: {
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
      },
    });

    // Get the array which will contain the points to render
    const vectorArray = generate(generatorClock, 100000, 1000);
    // const vectorArray = generateCamera(generatorClock, camera);

    // engineController binds the "p" key to pause the vectorArray generation
    const engineController = new EngineController(canvasContainer, [
      generatorClock,
    ]);

    // Setup the WebGL rendering
    const renderer = new Renderer(canvas, camera, renderClock, vectorArray);

    // Setup the camera movement controls, binding key presses to move the
    // camera around
    const movement = new Movement(canvasContainer, camera, physicsClock);

    // Listener to resize the canvas, the WebGL context and the camera aspect
    // ratio when the browser window resizes.
    // TODO: Assign the resizing into class methods rather than out here
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
/**
 * Maps an unknown HTMLElement to be a canvas element, if it is (null otherwise)
 * @param element the unknown HTMLElement
 */
function canvasElement(element: HTMLElement | null): HTMLCanvasElement | null {
  if (element instanceof HTMLCanvasElement) {
    const canvasElement = element as HTMLCanvasElement;
    return canvasElement;
  } else {
    return null;
  }
}

main();
