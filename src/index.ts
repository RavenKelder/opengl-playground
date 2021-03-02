import { Renderer } from "./webgl/render";
import config from "./config";
import { VectorGenerator } from "./model/generator";
import { Camera } from "./webgl/camera";
import { Movement } from "./controller/movement";
import { generatorClock, physicsClock, renderClock } from "./controller/clock";
import { EngineController } from "./controller/engine";
import {
  BedheadAttractor,
  CameraVector,
  CoordinatesVector,
  CyclicSymmetricAttractor,
  Grid,
  LorenzAttractor,
} from "./model/vectors";
import { VectorBuffers } from "./model/vectorBuffers";

const { page } = config;
let activeGenerator: VectorGenerator;

function swapGenerator(
  buffers: VectorBuffers,
  generator: VectorGenerator
): boolean {
  if (activeGenerator) {
    console.log("Detaching " + activeGenerator.name);
    activeGenerator.detach();
  }

  console.log("Attaching " + generator.name);
  generator.attach();
  activeGenerator = generator;
  return buffers.setActiveBuffer(generator.name);
}

/** Quite a hot mess at the moment; this function currently links the controller,
 * model and view together */
function main() {
  const canvasContainer = document.getElementById(page.CANVAS_CONTAINER_ID);
  const canvas = canvasElement(document.getElementById(page.CANVAS_ID));

  const buffers = new VectorBuffers([]);

  if (canvas && canvasContainer) {
    const camera = new Camera({
      perspective: {
        aspectRatio: canvas.clientWidth / canvas.clientHeight,
      },
    });

    // Get the array which will contain the points to render
    let csaGenerator = new VectorGenerator(
      "csa",
      new CyclicSymmetricAttractor(),
      buffers,
      generatorClock,
      {
        vectorAmount: 100000,
        vectorSize: 3,
        vectorType: "POINTS",
      },
      1000
    );

    let bhGenerator = new VectorGenerator(
      "bha",
      new BedheadAttractor(),
      buffers,
      generatorClock,
      {
        vectorAmount: 100000,
        vectorSize: 3,
        vectorType: "POINTS",
      },
      1000
    );

    let lrzaGenerator = new VectorGenerator(
      "lrza",
      new LorenzAttractor(),
      buffers,
      generatorClock,
      {
        vectorAmount: 100000,
        vectorSize: 3,
        vectorType: "POINTS",
      },
      1000
    );

    let cubeGenerator = new VectorGenerator(
      "cube",
      new Grid(50, 5),
      buffers,
      generatorClock,
      { vectorAmount: 250000, vectorSize: 3, vectorType: "POINTS" },
      1000
    );

    let camGenerator = new VectorGenerator(
      "cam",
      new CameraVector(camera),
      buffers,
      generatorClock,
      { vectorAmount: 1000, vectorSize: 3, vectorType: "POINTS" },
      1000
    );

    let worldGenerator = new VectorGenerator(
      "world",
      new CoordinatesVector(camera),
      buffers,
      generatorClock,
      { vectorAmount: 8, vectorSize: 3, vectorType: "LINES" },
      8
    );

    // engineController binds the "p" key to pause the vectorArray generation
    new EngineController(canvasContainer, [generatorClock]);

    // Setup the WebGL rendering
    const renderer = new Renderer(canvas, camera, renderClock, buffers);

    // Setup the camera movement controls, binding key presses to move the
    // camera around
    new Movement(canvasContainer, camera, physicsClock);

    // Listener to resize the canvas, the WebGL context and the camera aspect
    // ratio when the browser window resizes.
    // TODO: Assign the resizing into class methods rather than out here
    const onResize = () => {
      const width = window.innerWidth - 200;
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

    document
      .getElementById("lorenz-attractor")
      ?.addEventListener("click", () => {
        if (!swapGenerator(buffers, lrzaGenerator)) {
          console.log("Failed to attach lrza");
        } else {
          console.log("Attached lrza");
        }
      });

    document
      .getElementById("cam-coord-button")
      ?.addEventListener("click", () => {
        if (!swapGenerator(buffers, camGenerator)) {
          console.log("Failed to attach cam");
        } else {
          console.log("Attached cam");
        }
      });

    document.getElementById("cube-grid")?.addEventListener("click", () => {
      if (!swapGenerator(buffers, cubeGenerator)) {
        console.log("Failed to attach cube");
      } else {
        console.log("Attached cube");
      }
    });

    document
      .getElementById("bedhead-attractor")
      ?.addEventListener("click", () => {
        if (!swapGenerator(buffers, bhGenerator)) {
          console.log("Failed to attach bh");
        } else {
          console.log("Attached bh");
        }
      });

    document
      .getElementById("cyclic-attractor")
      ?.addEventListener("click", () => {
        if (!swapGenerator(buffers, csaGenerator)) {
          console.log("Failed to attach csa");
        } else {
          console.log("Attached csa");
        }
      });

    document
      .getElementById("world-coord-button")
      ?.addEventListener("click", () => {
        if (!swapGenerator(buffers, worldGenerator)) {
          console.log("Failed to attach world");
        } else {
          console.log("Attached world");
        }
      });

    const fpsDisplay = document.getElementById("fps-display-p");
    const ftDisplay = document.getElementById("frametime-display-p");
    const cdDisplay = document.getElementById("clocktime-display-p");

    setInterval(() => {
      if (fpsDisplay) {
        fpsDisplay.innerText = renderer.lastFPS.toString();
      }
      if (ftDisplay) {
        if (renderer.lastFPS != 0) {
          ftDisplay.innerText = (1000 / renderer.lastFPS).toFixed(2);
        }
      }
      if (cdDisplay) {
        cdDisplay.innerText = (1000 / renderClock.realTicksPerSecond).toFixed(
          2
        );
      }
    }, 1000);
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
