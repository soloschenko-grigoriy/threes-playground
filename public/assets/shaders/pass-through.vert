#version 300 es

precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec2 resolution;
uniform mat3 normalMatrix;
uniform mat4 modelMatrix;


layout (location = 0) in vec3 position;
layout (location = 1) in vec3 tangent;
layout (location = 2) in vec3 normal;
layout (location = 3) in vec2 uv;


out vec2 fragUV;
out vec3 fragNormal;
out vec3 fragWorldPosition;
out vec3 worldNormal;
out mat3 TBN;

void main()	{
  vec3 T = normalize(normalMatrix * tangent.xyz); // tangent vector in world space
  vec3 B = normalize(normalMatrix * cross(tangent.xyz, normal)); // bitangent vector in world space
  vec3 N = normalize(normalMatrix * normal); // normal vector in world space
  TBN = mat3(T, B, N);

  fragUV = uv;
  fragNormal = normalMatrix * normal;
  fragWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  worldNormal = normalize(normalMatrix * fragNormal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
