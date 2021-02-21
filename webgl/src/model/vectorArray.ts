export default interface VectorArray {
  buffer: number[];
  vectorSize: 1 | 2 | 3;
  numberOfVectors: number;
}
