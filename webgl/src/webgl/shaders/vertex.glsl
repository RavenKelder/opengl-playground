precision mediump float;
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 eye_position;
uniform float pointSize;

varying vec4 vertexPosition;

float fade(float pointDistance, float value);

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    float pointDistance = sqrt(
    pow(gl_Position.x - eye_position.x, 2.0) +
    pow(gl_Position.y - eye_position.y, 2.0) +
    pow(gl_Position.z - eye_position.z, 2.0)
  );

  gl_PointSize = fade(pointDistance, pointSize);
  vertexPosition = gl_Position;
}

float fade(float pointDistance, float value) {
  if (pointDistance > 1.5) {
    return 1.0;
  } 
  
  if (pointDistance > 1.0) {
    return 5.0;
  }

  if (pointDistance > 0.5) {
    return 10.0;
  }

  return 15.0;
}