#version 300 es
precision mediump float;

struct Material 
{
  vec4 Ambient;
  vec4 Diffuse;
  vec4 Specular;
  float Shininess;
  float Alpha;

  bool HasImageMap;
  bool HasBumpMap;
};
uniform Material U_Material;   

uniform vec4 colour;
out vec4 FragColor;

void main(void)
{
  FragColor = U_Material.Ambient;
}
