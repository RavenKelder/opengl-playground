import {
  Buffers,
  draw,
  ProgramInfo,
} from "./draw";
import {
  Vector,
  BedheadAttractor,
  LorenzAttractor,
} from "./vectors";
import { initialise } from "./webgl";

var vector: BedheadAttractor;
var lorenzVector: LorenzAttractor;
var offset: [number, number, number] = [
  0.0,
  0.0,
  -6.0,
];

export { vector, offset };

export function render() {
  const canvas = document.querySelector(
    "#glCanvas"
  ) as HTMLCanvasElement;
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  const program = initialise(gl);

  const programInfo: ProgramInfo = {
    program,
    attrLocations: {
      coordinate: gl.getAttribLocation(
        program,
        "aVertexPosition"
      ),
    },
    uniformLocations: {
      aspectRatio: gl.getUniformLocation(
        program,
        "aVertexPosition"
      ),
      pointSize: gl.getUniformLocation(
        program,
        "pointSize"
      ),
      projectionMatrix: gl.getUniformLocation(
        program,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(
        program,
        "uModelViewMatrix"
      ),
      seed: gl.getUniformLocation(
        program,
        "seed"
      ),
    },
  };

  var positions: number[] = new Array<number>(
    300000
  ).fill(0);

  var posIndex = 0;

  vector = new BedheadAttractor(-0.81, -0.92);
  lorenzVector = new LorenzAttractor();

  const calcPerSecond = 1000;

  (async () => {
    const bufferLength = positions.length / 3;

    while (1) {
      var nextPoint: [number, number, number];

      for (var i = 0; i < calcPerSecond; i++) {
        posIndex = posIndex % bufferLength;

        nextPoint = lorenzVector.coordinate();

        positions[posIndex * 3] = nextPoint[0];
        positions[posIndex * 3 + 1] =
          nextPoint[1];
        positions[posIndex * 3 + 2] =
          nextPoint[2];

        posIndex++;
      }

      const { x, y, z, r, b, s } = lorenzVector;

      await new Promise((res) =>
        setTimeout(res, 1)
      );
    }
  })();

  (async () => {
    while (1) {
      var phase =
        (2 *
          Math.PI *
          (new Date().getTime() % 1000)) /
        1000;

      draw(
        gl,
        programInfo,
        initBuffers(gl, positions),
        offset,
        2
      );

      await new Promise((res) =>
        setTimeout(res, 1000 / 25)
      );
    }
  })();
}

function initBuffers(
  gl: WebGLRenderingContext,
  buffer: number[]
): Buffers {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(buffer),
    gl.STATIC_DRAW
  );

  var pointSize = 3;
  var length = buffer.length / pointSize;

  return {
    positions: positionBuffer,
    length,
    vectorsSize: pointSize,
  };
}

function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (
    !gl.getShaderParameter(
      shader,
      gl.COMPILE_STATUS
    )
  ) {
    alert(
      "Failed to compile shaders: " +
        gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
