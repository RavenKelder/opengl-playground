export class VectorBuffers {
  activeBuffer: string;
  buffers: Map<string, VectorBuffer>;

  constructor(bufferSizes: BufferSetting[]) {
    this.buffers = new Map<string, VectorBuffer>();

    bufferSizes.forEach(({ name, vectorAmount, vectorSize, vectorType }) => {
      this.buffers.set(name, {
        name,
        vectorAmount,
        vectorSize,
        vectorType,
        buffer: new Float32Array(vectorAmount * vectorSize),
      });
    });

    if (bufferSizes.length > 0) {
      this.activeBuffer = bufferSizes[0].name;
    } else {
      this.activeBuffer = "";
    }
  }

  addBuffer(bufferSetting: BufferSetting): VectorBuffer | null {
    const { name, vectorAmount, vectorType, vectorSize } = bufferSetting;
    if (Object.keys(this.buffers).includes(name)) {
      return null;
    }

    const newBuffer: VectorBuffer = {
      name,
      vectorSize,
      vectorType,
      vectorAmount,
      buffer: new Float32Array(vectorSize * vectorAmount),
    };

    this.buffers.set(name, newBuffer);
    return newBuffer;
  }

  setActiveBuffer(name: string): boolean {
    if (Array.from(this.buffers.keys()).includes(name)) {
      this.activeBuffer = name;
      return true;
    }

    return false;
  }

  getCurrentBuffer(): VectorBuffer | undefined {
    return this.buffers.get(this.activeBuffer);
  }
}

export type BufferSetting = Omit<VectorBuffer, "buffer">;

export interface VectorBuffer {
  name: string;
  vectorSize: number;
  vectorAmount: number;
  vectorType: VectorType;
  buffer: Float32Array;
}

export type VectorType = "POINTS" | "LINES" | "TRIANGLES";
