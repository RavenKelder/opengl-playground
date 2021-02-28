import value from "*.glsl";
import { Clock } from "../controller/clock";
import VectorArray from "./vectorArray";
import { BedheadAttractor, Grid, LorenzAttractor } from "./vectors";

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

  const vector = new Grid(10, 1.0);
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
