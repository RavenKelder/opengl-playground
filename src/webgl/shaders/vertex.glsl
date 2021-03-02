precision mediump float;
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 eye_position;
uniform float pointSize;
uniform float viewDistance;

varying vec4 vertexPosition;
varying float fadeValue;
varying float fadeCloseByOverride;

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

  fadeCloseByOverride = fadeCloseBy(pointDistance);
  fadeValue = max(fade(pointDistance), fadeCloseByOverride);

  gl_PointSize = pointSize * fadePointSize(pointDistance);

  vertexPosition = aVertexPosition;
}

float fade(float pointDistance) {
  return 1.0 / (1.0 + exp(2.0 * (pointDistance - viewDistance)));
}

float fadeCloseBy(float pointDistance) {
  return 1.0 - (1.0 / (1.0 + exp(-10.0 * (pointDistance - 0.6))));
}

float fadePointSize(float pointDistance) {
  return 2.0 / pointDistance;
  // return (1.0 + (1.0 / (1.0 + exp(2.0 * (pointDistance - 2.5))))) * 3.0;
}