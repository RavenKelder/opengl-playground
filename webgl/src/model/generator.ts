import value from "*.glsl";
import { vec3 } from "gl-matrix";
import { Clock } from "../controller/clock";
import { Camera } from "../webgl/camera";
import VectorArray from "./vectorArray";
import {
  BedheadAttractor,
  CyclicSymmetricAttractor,
  Grid,
  HenonAttractor,
  LorenzAttractor,
  MergedVectors,
} from "./vectors";

export function generate(
  clock: Clock,
  vectorsPerBuffer: number,
  valuesPerIteration: number = 1000
): VectorArray {
  const vectorSize = 3;

  const vectorArray: VectorArray = {
    buffer: new Array(vectorsPerBuffer * vectorSize).fill(0),
    vectorSize,
    numberOfVectors: vectorsPerBuffer,
  };

  const vector = new MergedVectors(new CyclicSymmetricAttractor());
  var index = 0;

  var generatedValues = 0;

  clock.addEventListener("tick", () => {
    for (let i = 0; i < valuesPerIteration; i++) {
      index = index % vectorArray.numberOfVectors;

      var nextVector = vector.coordinate();

      vectorArray.buffer[index * vectorSize] = nextVector[0];
      vectorArray.buffer[index * vectorSize + 1] = nextVector[1];
      vectorArray.buffer[index * vectorSize + 2] = nextVector[2];

      index++;
    }

    generatedValues = generatedValues + valuesPerIteration * vectorSize;
  });

  return vectorArray;
}

export function generateCamera(clock: Clock, camera: Camera) {
  const rep = 10;
  const vectorArray: VectorArray = {
    buffer: new Array(3).fill(0),
    vectorSize: 3,
    numberOfVectors: 2 + 10 * 3,
  };

  clock.addEventListener("tick", () => {
    var nextVector = camera.eye;

    vectorArray.buffer[0] = nextVector[0];
    vectorArray.buffer[1] = nextVector[1];
    vectorArray.buffer[2] = nextVector[2];

    const { u, v, n } = camera.eyeCoordinate;

    var offset = 3;
    [u, v, n].forEach((dir) => {
      for (let i = 0; i < rep; i++) {
        let nextPoint = vec3.scaleAndAdd(
          vec3.create(),
          camera.eye,
          dir,
          0.1 * (i + 1)
        );
        vectorArray.buffer[offset] = nextPoint[0];
        vectorArray.buffer[offset + 1] = nextPoint[1];
        vectorArray.buffer[offset + 2] = nextPoint[2];

        offset = offset + 3;
      }
    });

    vectorArray.buffer[offset] = camera.lookingAt[0] * 2;
    vectorArray.buffer[offset + 1] = camera.lookingAt[1] * 2;
    vectorArray.buffer[offset + 2] = camera.lookingAt[2] * 2;
  });

  return vectorArray;
}
