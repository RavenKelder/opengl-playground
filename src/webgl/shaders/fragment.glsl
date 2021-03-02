#define M_PI 3.1415926535897932384626433832795

precision mediump float;
uniform float clock;
uniform vec3 eye_position;

varying vec4 vertexPosition;
varying float fadeValue;
varying float fadeCloseByOverride;

float redOffset = 0.0;
float greenOffset = (2.0 / 3.0) * M_PI;
float blueOffset = (4.0 / 3.0) * M_PI;

void main() {
  float normalised = clock * 2.0 * M_PI;
  float redVal =  sin(normalised + redOffset) / 2.0 + 1.0;
  float greenVal = sin(normalised + greenOffset) / 2.0 + 0.5;
  float blueVal = sin(normalised + blueOffset) / 2.0 + 0.5;

  gl_FragColor = vec4(
    (1.0 - redVal * (1.0 - 0.5 * fadeCloseByOverride)) * fadeValue, 
    (1.0 - greenVal * (1.0 - 0.5 * fadeCloseByOverride)) * fadeValue, 
    (1.0 - blueVal * (1.0 - 0.5 * fadeCloseByOverride)) * fadeValue, 
    1
  );
}