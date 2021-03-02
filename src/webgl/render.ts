import { Camera } from "./camera";
import { Display } from "./draw";

import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import { Clock } from "../controller/clock";
import { VectorBuffers } from "../model/vectorBuffers";

export class Renderer {
  context: WebGLRenderingContext;
  buffers: VectorBuffers;
  camera: Camera;
  display: Display;
  contextBuffer: WebGLBuffer;
  frameCounter: number = 0;
  lastFPS: number = 0;
  lastFPSTime: number;
  rendering: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    camera: Camera,
    clock: Clock,
    buffers: VectorBuffers
  ) {
    const context = canvas.getContext("webgl2");

    if (!context) {
      throw new Error("Unable to initialise WebGL context.");
    }

    this.context = context;

    this.display = new Display(
      context,
      {
        vertexSource: vertexShaderSource,
        fragmentSource: fragmentShaderSource,
      },
      camera,
      true
    );

    this.display.setVertexSize(1);

    const contextBuffer = context.createBuffer();
    if (!contextBuffer) {
      throw new Error("Unable to bind WebGL buffer to context.");
    }

    this.contextBuffer = contextBuffer;

    context.bindBuffer(context.ARRAY_BUFFER, this.contextBuffer);

    this.camera = camera;

    this.buffers = buffers;

    this.lastFPSTime = performance.now();

    clock.addEventListener("tick", () => {
      if (this.rendering) {
        return;
      }

      this.rendering = true;
      const { context, display, buffers } = this;
      const activeBuffer = buffers.getCurrentBuffer();
      if (!activeBuffer) {
        this.rendering = false;
        return;
      }

      const { buffer, vectorSize, vectorAmount, vectorType } = activeBuffer;

      context.bufferData(context.ARRAY_BUFFER, buffer, context.STATIC_DRAW);

      display.drawVertices(contextBuffer, vectorSize, vectorAmount, vectorType);

      this.frameCounter++;

      const now = performance.now();

      if (now - this.lastFPSTime >= 1000) {
        this.lastFPS = this.frameCounter;
        this.frameCounter = 0;
        this.lastFPSTime = now;
      }

      this.rendering = false;
    });
  }
}
