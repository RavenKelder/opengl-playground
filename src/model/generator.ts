import { Clock } from "../controller/clock";
import { BufferSetting, VectorBuffer, VectorBuffers } from "./vectorBuffers";
import { Vector } from "./vectors";

export class VectorGenerator {
  name: string;
  generator: Vector;
  buffers: VectorBuffers;
  vectorBuffer: VectorBuffer;
  clock: Clock;
  vectorsPerIteration: number;
  bufferIndex: number;
  totalGeneratedValues: number;
  working: boolean = false;
  onTick: () => void;
  isEnabled: boolean = false;

  constructor(
    name: string,
    vector: Vector,
    vectorBuffers: VectorBuffers,
    clock: Clock,
    bufferSetting: Omit<BufferSetting, "name">,
    vectorsPerIteration: number
  ) {
    this.name = name;
    this.generator = vector;
    this.buffers = vectorBuffers;
    this.clock = clock;
    this.vectorsPerIteration = vectorsPerIteration;
    this.bufferIndex = 0;
    this.totalGeneratedValues = 0;

    const newVectorBuffer = this.buffers.addBuffer({ name, ...bufferSetting });
    if (newVectorBuffer) {
      this.vectorBuffer = newVectorBuffer;
    } else {
      throw new Error("Failed to allocate buffer " + name);
    }

    const onTick = () => {
      const { vectorAmount, vectorSize, buffer } = newVectorBuffer;
      for (let i = 0; i < vectorsPerIteration; i++) {
        this.bufferIndex = this.bufferIndex % vectorAmount;
        var nextVector = vector.coordinate();

        buffer[this.bufferIndex * vectorSize] = nextVector[0];
        buffer[this.bufferIndex * vectorSize + 1] = nextVector[1];
        buffer[this.bufferIndex * vectorSize + 2] = nextVector[2];

        this.bufferIndex = this.bufferIndex + 1;
      }
    };

    this.onTick = onTick;
  }

  attach(): boolean {
    if (this.isEnabled) {
      return false;
    }

    this.clock.addEventListener("tick", this.onTick);
    this.isEnabled = true;
    return true;
  }

  detach() {
    if (!this.isEnabled) {
      return false;
    }

    this.clock.removeEventListener("tick", this.onTick);
    this.isEnabled = false;
    return true;
  }
}
