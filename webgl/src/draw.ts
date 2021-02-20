import { mat4 } from "gl-matrix";

export function draw(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: Buffers,
  offset: [number, number, number],
  pointSize: number
) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(
    gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
  );

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect =
    (gl.canvas as HTMLCanvasElement).clientWidth /
    (gl.canvas as HTMLCanvasElement).clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(
    projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar
  );

  const modelViewMatrix = mat4.create();

  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    offset
  );

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    buffers.positions
  );

  gl.vertexAttribPointer(
    programInfo.attrLocations["coordinate"],
    buffers.vectorsSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(
    programInfo.attrLocations["coordinate"]
  );

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations[
      "projectionMatrix"
    ],
    false,
    projectionMatrix
  );

  gl.uniformMatrix4fv(
    programInfo.uniformLocations[
      "modelViewMatrix"
    ],
    false,
    modelViewMatrix
  );

  var phase =
    (2 *
      Math.PI *
      (new Date().getTime() % 5000)) /
    5000;

  gl.uniform1f(
    programInfo.uniformLocations["seed"],
    phase
  );

  gl.uniform1f(
    programInfo.uniformLocations["pointSize"],
    pointSize
  );
  gl.drawArrays(gl.POINTS, 0, buffers.length);
}

export interface ProgramInfo {
  program: WebGLProgram;
  attrLocations: {
    [attr: string]: number;
  };
  uniformLocations: {
    [uniform: string]: WebGLUniformLocation;
  };
}

export interface Buffers {
  positions: WebGLBuffer;
  length: number;
  vectorsSize: number;
}
