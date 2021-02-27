import VectorArray from "./vectorArray";
import { BedheadAttractor, LorenzAttractor } from "./vectors";

export function generate(
  controller: EventTarget,
  vectorsPerBuffer: number,
  iterationDelay: number = 1,
  valuesPerIteration: number = 1000
): VectorArray {
  var halt = false;

  const vectorSize = 3;

  const vectorArray: VectorArray = {
    buffer: new Array(vectorsPerBuffer * vectorSize).fill(0),
    vectorSize,
    numberOfVectors: vectorsPerBuffer,
  };

  const vector = new LorenzAttractor();
  var index = 0;

  controller.addEventListener("stop", () => {
    halt = true;
  });

  var generatedValues = 0;

  (async () => {
    while (!halt) {
      for (var i = 0; i < valuesPerIteration; i++) {
        index = index % vectorArray.numberOfVectors;

        var nextVector = vector.coordinate();

        vectorArray.buffer[index * vectorSize] = nextVector[0];
        vectorArray.buffer[index * vectorSize + 1] = nextVector[1];
        vectorArray.buffer[index * vectorSize + 2] = nextVector[2];

        index++;
      }

      generatedValues = generatedValues + valuesPerIteration * vectorSize;

      if (generatedValues > vectorArray.buffer.length) {
        controller.dispatchEvent(new Event("start"));
        // halt = true;
      }

      await new Promise((res) => setTimeout(res, iterationDelay));
    }
  })();

  return vectorArray;
}
