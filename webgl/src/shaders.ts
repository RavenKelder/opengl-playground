const vertexShaderSource = `
  precision mediump float;
	attribute vec4 aVertexPosition;

	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	uniform float pointSize;

	void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		gl_PointSize = pointSize;
	}
`;

const fragmentShaderSource = `
  #define M_PI 3.1415926535897932384626433832795

  precision mediump float;
	uniform float seed;

	float redOffset = 0.0;
	float greenOffset = (2.0 / 3.0) * M_PI;
	float blueOffset = (4.0 / 3.0) * M_PI;

	void main() {
		float redVal = sin(seed + redOffset);
		float greenVal = sin(seed + greenOffset);
		float blueVal = sin(seed + blueOffset);

		gl_FragColor = vec4(redVal, greenVal, blueVal, 1.0);
	}
`;

export {
  vertexShaderSource,
  fragmentShaderSource,
};
