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
float fadeCloseBy(float pointDistance);
float fadePointSize(float pointDistance);

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
   float pointDistance = sqrt(
    pow(aVertexPosition.x - eye_position.x, 2.0) +
    pow(aVertexPosition.y - eye_position.y, 2.0) +
    pow(aVertexPosition.z - eye_position.z, 2.0)
  );

  if (pointDistance >= 0.2) {
    fadeValue = fade(pointDistance);
  } else {
    fadeValue = fadeCloseBy(pointDistance);
  }

  gl_PointSize = fadeValue * pointSize * fadePointSize(pointDistance);

  vertexPosition = aVertexPosition;
}

float fade(float pointDistance) {
  return 1.0 / (1.0 + exp(viewDistance * (pointDistance - viewDistance)));
}

float fadeCloseBy(float pointDistance) {
  return 1.0 / (1.0 + exp(-100.0 * (pointDistance - 0.075)));
}

float fadePointSize(float pointDistance) {
  return 1.0 + (1.0 / (1.0 + exp(2.0 * (pointDistance - 2.5))));
}