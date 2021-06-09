#version 300 es

precision mediump float;

uniform float time;
uniform vec3 cameraPosition;
uniform vec3 mainColor;
uniform sampler2D diffuseTex;
uniform sampler2D normalTex;

in vec2 fragUV;
in vec3 fragNormal;
in vec3 fragWorldPosition;
in vec3 worldNormal;
in mat3 TBN;

out vec4 outColor;


void main()	{
  vec3 normalDir = texture(normalTex, fragUV).rgb;
  normalDir = normalize(normalDir * 2.0 - 1.0);
  normalDir = normalize(TBN * normalDir);

  vec4 meshColor = texture(diffuseTex, fragUV);

  float dirVertex = (dot(fragWorldPosition, normalize(vec3(0., 1., 0.))) + 1.) / 2.;
  float scan = step(0.5, fract(dirVertex * 2. + time * 0.5)) * 0.65;
  // float glow = fract(dirVertex - time * 0.05);

  vec3 viewDir = normalize(cameraPosition - fragWorldPosition);

  float rim = 1.0 - clamp(dot(viewDir, normalDir), 0., 1.);
	vec4 rimColor = vec4(0.972549, 1, 0, 1) * pow(rim, 5.16);

  outColor = meshColor + rimColor;
  outColor.a = rim + scan;
}
