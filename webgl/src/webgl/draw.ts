import config from "../config";
import { Camera } from "./camera";

export class Display {
  program!: WebGLProgram;
  context: WebGLRenderingContext;
  camera: Camera;

  ready: boolean = false;

  vertexSize: number = 3;

  attrLocations: {
    coordinates: number;
  };

  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    viewMatrix: WebGLUniformLocation;
    clock: WebGLUniformLocation;
    pointSize: WebGLUniformLocation;
  };

  constructor(
    context: WebGLRenderingContext,
    shaders: {
      vertexSource: string;
      fragmentSource: string;
    },
    camera: Camera
  ) {
    this.context = context;
    this.createProgram(shaders.vertexSource, shaders.fragmentSource);

    var errors: string[] = [];

    const attributeLocations = [config.shaders.attributes.VERTEX_POSITION];

    const attributeLocationValues = attributeLocations.map((location) =>
      context.getAttribLocation(this.program, location)
    );

    const invalidAttributeLocationExists = attributeLocationValues.reduce<boolean>(
      (prev, current, index) => {
        if (current < 0) {
          errors.push(
            `Cannot find attribute location ${attributeLocations[index]}`
          );
          return true;
        } else {
          return prev || false;
        }
      },
      false
    );

    const uniformLocations = [
      config.shaders.uniforms.MODEL_VIEW_MATRIX,
      config.shaders.uniforms.POINT_SIZE,
      config.shaders.uniforms.PROJECTION_MATRIX,
      config.shaders.uniforms.CLOCK,
    ];

    const uniformLocationObjects = uniformLocations.map((location) =>
      context.getUniformLocation(this.program, location)
    );

    const invalidUniformLocationExists = uniformLocationObjects.reduce<boolean>(
      (prev, current, index) => {
        if (!current) {
          errors.push(
            `Cannot find uniform location "${uniformLocations[index]}"`
          );
          return true;
        } else {
          return prev || false;
        }
      },
      false
    );

    if (invalidAttributeLocationExists || invalidUniformLocationExists) {
      throw new Error(errors.reduce((prev, current) => prev + "\n" + current));
    }

    this.attrLocations = {
      coordinates: attributeLocationValues[0],
    };

    // The previous checks guarantee these uniform locations are valid
    this.uniformLocations = {
      projectionMatrix: uniformLocationObjects[2] as WebGLUniformLocation,
      viewMatrix: uniformLocationObjects[0] as WebGLUniformLocation,
      clock: uniformLocationObjects[3] as WebGLUniformLocation,
      pointSize: uniformLocationObjects[1] as WebGLUniformLocation,
    };

    this.camera = camera;

    this.ready = true;
  }

  createProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): void {
    this.ready = false;

    const { context, _loadShader } = this;
    const vertexShader = this._loadShader(
      context.VERTEX_SHADER,
      vertexShaderSource
    );

    const fragmentShader = this._loadShader(
      context.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const newProgram = context.createProgram();
    if (!newProgram) {
      throw new Error("Cannot create new WebGL program.");
    }

    context.attachShader(newProgram, vertexShader);
    context.attachShader(newProgram, fragmentShader);

    context.linkProgram(newProgram);

    if (!context.getProgramParameter(newProgram, context.LINK_STATUS)) {
      const error = new Error(
        "Failed to link shaders:\n" + context.getProgramInfoLog(newProgram)
      );

      context.deleteProgram(newProgram);
      context.linkProgram(this.program);
      this.ready = true;
      throw error;
    }

    context.deleteProgram(this.program);

    this.program = newProgram;
    this.ready = true;
  }

  _loadShader(type: number, source: string): WebGLShader {
    const { context } = this;
    const shader = context.createShader(type);

    if (!shader) {
      context.deleteShader(shader);
      throw new Error("Failed to create shader:\n" + source);
    }

    context.shaderSource(shader, source);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      const error = new Error(
        "Failed to compile shaders: \n" + context.getShaderInfoLog(shader)
      );
      context.deleteShader(shader);
      throw error;
    }

    return shader;
  }

  setVertexSize(val: number): boolean {
    if (val < 0) {
      return false;
    }

    this.vertexSize = val;
    return true;
  }

  drawVertices(
    vertices: WebGLBuffer,
    vectorSize: 1 | 2 | 3,
    bufferSize: number
  ): boolean {
    if (!this.ready) {
      return false;
    }

    const {
      context,
      program,
      camera,
      vertexSize,
      attrLocations,
      uniformLocations,
    } = this;
    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clearDepth(1.0);
    context.enable(context.DEPTH_TEST);
    context.depthFunc(context.LEQUAL);
    context.clear(context.DEPTH_BUFFER_BIT | context.COLOR_BUFFER_BIT);

    context.bindBuffer(context.ARRAY_BUFFER, vertices);

    context.vertexAttribPointer(
      attrLocations.coordinates,
      vectorSize,
      context.FLOAT,
      false,
      0,
      0
    );
    context.enableVertexAttribArray(attrLocations.coordinates);

    context.useProgram(program);

    context.uniformMatrix4fv(
      uniformLocations.projectionMatrix,
      false,
      camera.perspectiveMatrix
    );

    context.uniformMatrix4fv(
      uniformLocations.viewMatrix,
      false,
      camera.updateTransformation()
    );

    const clock = (new Date().getTime() % 10000) / 10000;

    context.uniform1f(uniformLocations.clock, clock);

    context.uniform1f(uniformLocations.pointSize, vertexSize);

    context.drawArrays(context.POINTS, 0, bufferSize);

    return true;
  }
}
