import { vec3 } from "gl-matrix";
import { Clock } from "../controller/clock";
import { Camera } from "../webgl/camera";
import { BufferSetting, VectorBuffer, VectorBuffers } from "./vectorBuffers";
import { Vector } from "./vectors";

export function generate(
  name: string,
  clock: Clock,
  vectorsPerBuffer: number,
  valuesPerIteration: number = 1000,
  vector: Vector,
  buffers: VectorBuffers
): [VectorBuffer, () => void] {
  const bufferSetting: BufferSetting = {
    name,
    vectorAmount: vectorsPerBuffer,
    vectorSize: 3,
    vectorType: "POINTS",
  };

  const vectorBuffer = buffers.addBuffer(bufferSetting);

  if (!vectorBuffer) {
    throw new Error("Failed to allocate buffer " + name);
  }
  var index = 0;

  var generatedValues = 0;

  const callback = () => {
    const { vectorAmount, vectorSize, buffer } = vectorBuffer;
    for (let i = 0; i < valuesPerIteration; i++) {
      index = index % vectorAmount;
      var nextVector = vector.coordinate();

      buffer[index * vectorSize] = nextVector[0];
      buffer[index * vectorSize + 1] = nextVector[1];
      buffer[index * vectorSize + 2] = nextVector[2];

      index++;
    }

    generatedValues = generatedValues + valuesPerIteration * vectorSize;
  };

  clock.addEventListener("tick", callback);

  return [
    vectorBuffer,
    () => {
      clock.removeEventListener("tick", callback);
    },
  ];
}

export function generateCamera(
  name: string,
  clock: Clock,
  camera: Camera,
  pointsPerDirection: number,
  distanceBetweenPoints: number,
  buffers: VectorBuffers
): [VectorBuffer, () => void] {
  const bufferSetting: BufferSetting = {
    name,
    vectorAmount: 2 + pointsPerDirection * 3,
    vectorSize: 3,
    vectorType: "POINTS",
  };

  const vectorBuffer = buffers.addBuffer(bufferSetting);
  if (!vectorBuffer) {
    throw new Error("Failed to allocate buffer " + name);
  }

  const callback = () => {
    const { buffer } = vectorBuffer;
    var nextVector = camera.eye;

    buffer[0] = nextVector[0];
    buffer[1] = nextVector[1];
    buffer[2] = nextVector[2];

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
        buffer[offset] = nextPoint[0];
        buffer[offset + 1] = nextPoint[1];
        buffer[offset + 2] = nextPoint[2];

        offset = offset + 3;
      }
    });

    const lookingAt = vec3.scaleAndAdd(
      vec3.create(),
      camera.eye,
      camera.lookingAt,
      pointsPerDirection * distanceBetweenPoints
    );

    buffer[offset] = lookingAt[0];
    buffer[offset + 1] = lookingAt[1];
    buffer[offset + 2] = lookingAt[2];
  };

  clock.addEventListener("tick", callback);

  return [
    vectorBuffer,
    () => {
      clock.removeEventListener("tick", callback);
    },
  ];
}
