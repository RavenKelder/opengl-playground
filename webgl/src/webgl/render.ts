import { Camera } from "./camera";
import { Display } from "./draw";

import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import VectorArray from "../model/vectorArray";

export class Renderer {
  context: WebGLRenderingContext;
  vertices: VectorArray;
  camera: Camera;
  frameRate: number;
  display: Display;
  contextBuffer: WebGLBuffer;
  enabled: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    camera: Camera,
    frameRate: number,
    vertices: VectorArray
  ) {
    const context = canvas.getContext("webgl");

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
      camera
    );

    this.display.setVertexSize(1);

    const contextBuffer = context.createBuffer();
    if (!contextBuffer) {
      throw new Error("Unable to bind WebGL buffer to context.");
    }

    this.contextBuffer = contextBuffer;

    context.bindBuffer(context.ARRAY_BUFFER, this.contextBuffer);

    this.camera = camera;

    this.frameRate = frameRate;

    this.vertices = vertices;
  }

  start(): boolean {
    if (this.enabled) {
      return false;
    }
    this.enabled = true;

    const { context, vertices, display, contextBuffer, frameRate } = this;

    (async () => {
      while (this.enabled) {
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

        await new Promise((res) => setTimeout(res, 1000 / frameRate));
      }
    })();

    return true;
  }

  stop(): boolean {
    if (!this.enabled) {
      return false;
    }

    this.enabled = false;
    return true;
  }
}