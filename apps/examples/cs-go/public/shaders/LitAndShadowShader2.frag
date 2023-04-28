#version 300 es

precision highp float;
precision highp sampler2D;

in vec3 V_Position;
in vec3 V_Normal;
in vec2 V_UV;
in vec3 V_Colour;

layout(location = 0) out vec4 O_DiffuseSpecular;
layout(location = 1) out vec3 O_Position;
layout(location = 2) out vec3 O_Normal;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
};
uniform Sampler U_Sampler;

void main(void)
{
    O_DiffuseSpecular = vec4(V_Colour, 1.0) * texture(U_Sampler.Image, V_UV);
    O_Position = V_Position;
    O_Normal = normalize(V_Normal * texture(U_Sampler.Bump, V_UV).xyz);
    O_DiffuseSpecular = vec4(1.0, 1.0, 1.0, 1.0);
}
