#version 300 es
#pragma vscode_glsllint_stage: frag

precision highp float;
precision highp sampler2D;

layout (std140) uniform;
layout(location = 0) out vec3 O_Position;
layout(location = 1) out vec3 O_Normal;
layout(location = 2) out vec4 O_Albedo_Alpha;

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
in Vertex V_Vertex;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
};
uniform Sampler U_Sampler;

uniform BasicLitMaterial
{
    vec3 Colour;
    float Shininess;
    float Alpha;

    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;

    bool HasImageMap;
    bool HasBumpMap;
    bool ReceiveShadows;
} basicLitMaterial;

void main(void)
{
    vec4 tex = texture(U_Sampler.Image, V_Vertex.UV);
    vec3 albedo = basicLitMaterial.Colour * tex.rgb * V_Vertex.Colour;
    float alpha = basicLitMaterial.Alpha * tex.a;

    O_Position = V_Vertex.Position;
    O_Normal = normalize(V_Vertex.Normal * texture(U_Sampler.Bump, V_Vertex.UV).xyz);
    O_Albedo_Alpha = vec4(albedo, alpha);
    // O_Position = vec3(1.0);
}