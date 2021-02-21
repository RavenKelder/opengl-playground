import { mat4 } from "gl-matrix";

const defaultPerspective: Perspective = {
  fieldOfView: (45 / 180) * Math.PI,
  aspectRatio: 1.0,
  viewRange: [0.1, 100.0],
};

const defaultTransformation: Transformation = {
  rotation: [0.0, 0.0, 0.0],
  translation: [0.0, 0.0, -6.0],
};

export class Camera {
  perspectiveMatrix: mat4;
  transformationMatrix: mat4;

  rotation: [number, number, number];
  translation: [number, number, number];

  constructor(options?: {
    perspective?: Partial<Perspective>;
    transformation?: Partial<Transformation>;
  }) {
    const [fieldOfView, aspectRatio, viewRange] = [
      options?.perspective?.fieldOfView ?? defaultPerspective.fieldOfView,
      options?.perspective?.aspectRatio ?? defaultPerspective.aspectRatio,
      options?.perspective?.viewRange ?? defaultPerspective.viewRange,
    ];

    this.perspectiveMatrix = mat4.create();
    this.perspectiveMatrix = mat4.perspective(
      this.perspectiveMatrix,
      fieldOfView,
      aspectRatio,
      viewRange[0],
      viewRange[1]
    );

    const [translation, rotation] = [
      options?.transformation?.translation ?? defaultTransformation.translation,
      options?.transformation?.rotation ?? defaultTransformation.rotation,
    ];

    this.translation = translation;
    this.rotation = rotation;

    this.transformationMatrix = mat4.create();
    this.transformationMatrix = mat4.translate(
      this.transformationMatrix,
      this.transformationMatrix,
      translation
    );
    this.transformationMatrix = mat4.rotateX(
      this.transformationMatrix,
      this.transformationMatrix,
      rotation[0]
    );
    this.transformationMatrix = mat4.rotateY(
      this.transformationMatrix,
      this.transformationMatrix,
      rotation[1]
    );
    this.transformationMatrix = mat4.rotateZ(
      this.transformationMatrix,
      this.transformationMatrix,
      rotation[2]
    );
  }
}

export interface Perspective {
  fieldOfView: number;
  aspectRatio: number;
  viewRange: [number, number];
}

export interface Transformation {
  translation: [number, number, number];
  rotation: [number, number, number];
}
