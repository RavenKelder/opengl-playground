import { Camera } from "./camera";
import { Display } from "./draw";

import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import VectorArray from "../model/vectorArray";
import { Clock } from "../controller/clock";

export class Renderer {
  context: WebGLRenderingContext;
  vertices: VectorArray;
  camera: Camera;
  display: Display;
  contextBuffer: WebGLBuffer;
  frameCounter: number = 0;
  lastFPS: number = 0;
  lastFPSTime: Date;

  constructor(
    canvas: HTMLCanvasElement,
    camera: Camera,
    clock: Clock,
    vertices: VectorArray
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

    this.vertices = vertices;

    this.lastFPSTime = new Date();

    clock.addEventListener("tick", () => {
      const { context, display } = this;
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array(vertices.buffer),
        context.STATIC_DRAW
      );

      display.drawVertices(
        contextBuffer,
        vertices.vectorSize,
        vertices.buffer.length / vertices.vectorSize
      );

      this.frameCounter++;

      if (new Date().getTime() - this.lastFPSTime.getTime() >= 1000) {
        this.lastFPS = this.frameCounter;
        this.frameCounter = 0;
        this.lastFPSTime = new Date();
      }
    });
  }
}
