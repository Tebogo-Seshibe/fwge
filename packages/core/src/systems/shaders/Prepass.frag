#version 300 es
#pragma vscode_glsllint_stage: frag
precision highp float;

layout(location = 0) out vec3 O_Position;
layout(location = 1) out vec3 O_Normal;
layout(location = 2) out vec4 O_ColourSpecular;

// Position         Position            Position
// Normal           Normal              Normal
// Diffuse          Diffuse             Diffuse             Specular
// AmbientOcclusion AmbientOcclusion    AmbientOcclusion    RoughnessMetallic

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
in Vertex V_Vertex;

mat
struct Material
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
};
uniform Material U_Material;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D ShadowMap;
    sampler2D DirectionalShadow;
};
uniform Sampler U_Sampler;

void main(void)
{
    vec4 tex = texture(U_Sampler.Image, V_Vertex.UV);
    vec3 albedo = U_Material.Colour * tex.rgb * V_Vertex.Colour;
    float alpha = U_Material.Alpha * tex.a;

    O_Position = V_Vertex.Position;
    O_Normal = normalize(V_Vertex.Normal);
    O_ColourSpecular = vec4(albedo, alpha);
}