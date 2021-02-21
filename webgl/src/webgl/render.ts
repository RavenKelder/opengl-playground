import { Camera } from "./camera";
import { Display } from "./draw";

import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import VectorArray from "../model/vectorArray";

async function render(
  controller: EventTarget,
  canvas: HTMLCanvasElement,
  vertices: VectorArray,
  camera: Camera,
  frameRate: number = 30
): Promise<Status> {
  const gl = canvas.getContext("webgl");

  if (!gl) {
    throw new Error("Unable to initialise WebGL.");
  }

  const display = new Display(
    gl,
    {
      vertexSource: vertexShaderSource,
      fragmentSource: fragmentShaderSource,
    },
    camera
  );

  display.setVertexSize(display, 1);

  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error("Failed to create buffer.");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  await new Promise((res) => {
    controller.addEventListener("start", () => {
      res(null);
    });
  });

  var halt = false;
  controller.addEventListener("stop", () => {
    halt = true;
  });

  while (!halt) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices.buffer),
      gl.STATIC_DRAW
    );

    display.drawVertices(
      display,
      buffer,
      vertices.vectorSize,
      vertices.buffer.length / vertices.vectorSize
    );

    await new Promise((res) => setTimeout(res, 1000 / frameRate));
  }

  return Status.EXIT;
}

enum Status {
  PAUSED,
  EXIT,
}

export { render };
