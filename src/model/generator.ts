import { vec3 } from "gl-matrix";
import { Clock } from "../controller/clock";
import { Camera } from "../webgl/camera";
import VectorArray from "./vectorArray";
import { Vector } from "./vectors";

export function generate(
  clock: Clock,
  vectorsPerBuffer: number,
  valuesPerIteration: number = 1000,
  vector: Vector
): [VectorArray, () => void] {
  const vectorSize = 3;

  const vectorArray: VectorArray = {
    buffer: new Array(vectorsPerBuffer * vectorSize).fill(0),
    vectorSize,
    numberOfVectors: vectorsPerBuffer,
  };
  var index = 0;

  var generatedValues = 0;

  const callback = () => {
    for (let i = 0; i < valuesPerIteration; i++) {
      index = index % vectorArray.numberOfVectors;

      var nextVector = vector.coordinate();

      vectorArray.buffer[index * vectorSize] = nextVector[0];
      vectorArray.buffer[index * vectorSize + 1] = nextVector[1];
      vectorArray.buffer[index * vectorSize + 2] = nextVector[2];

      index++;
    }

    generatedValues = generatedValues + valuesPerIteration * vectorSize;
  };

  clock.addEventListener("tick", callback);

  return [
    vectorArray,
    () => {
      clock.removeEventListener("tick", callback);
    },
  ];
}

export function generateCamera(
  clock: Clock,
  camera: Camera,
  pointsPerDirection: number,
  distanceBetweenPoints: number
): [VectorArray, () => void] {
  const vectorArray: VectorArray = {
    buffer: new Array(3).fill(0),
    vectorSize: 3,
    numberOfVectors: 2 + pointsPerDirection * 3,
  };

  const callback = () => {
    var nextVector = camera.eye;

    vectorArray.buffer[0] = nextVector[0];
    vectorArray.buffer[1] = nextVector[1];
    vectorArray.buffer[2] = nextVector[2];

    const { u, v, n } = camera.eyeCoordinate;

    var offset = 3;
    [u, v, n].forEach((dir) => {
      for (let i = 0; i < pointsPerDirection; i++) {
        let nextPoint = vec3.scaleAndAdd(
          vec3.create(),
          camera.eye,
          dir,
          distanceBetweenPoints * (i + 1)
        );
        vectorArray.buffer[offset] = nextPoint[0];
        vectorArray.buffer[offset + 1] = nextPoint[1];
        vectorArray.buffer[offset + 2] = nextPoint[2];

        offset = offset + 3;
      }
    });

    const lookingAt = vec3.scaleAndAdd(
      vec3.create(),
      camera.eye,
      camera.lookingAt,
      pointsPerDirection * distanceBetweenPoints
    );

    vectorArray.buffer[offset] = lookingAt[0];
    vectorArray.buffer[offset + 1] = lookingAt[1];
    vectorArray.buffer[offset + 2] = lookingAt[2];
  };

  clock.addEventListener("tick", callback);

  return [
    vectorArray,
    () => {
      clock.removeEventListener("tick", callback);
    },
  ];
}
