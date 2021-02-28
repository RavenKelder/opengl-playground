precision mediump float;
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 eye_position;
uniform float pointSize;
uniform float viewDistance;

varying vec4 vertexPosition;
varying float fadeValue;

float fade(float pointDistance);

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
   float pointDistance = sqrt(
    pow(aVertexPosition.x - eye_position.x, 2.0) +
    pow(aVertexPosition.y - eye_position.y, 2.0) +
    pow(aVertexPosition.z - eye_position.z, 2.0)
  );

  fadeValue = fade(pointDistance);

  gl_PointSize = fadeValue * pointSize;

  vertexPosition = aVertexPosition;
}

float fade(float pointDistance) {
  return 1.0 / (1.0 + exp(viewDistance * (pointDistance - viewDistance)));;
}