export const cubeShaderVert = 
`#version 300 es
#pragma vscode_glsllint_stage: vert

layout (std140) uniform;
precision highp float;

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec4 A_Colour;

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
out Vertex V_Vertex;

uniform Object
{
    mat4 ModelViewMatrix;
    mat3 NormalMatrix;
} object;

uniform Camera
{
    mat4 ViewMatrix;
    mat4 ProjectionMatrix;
} camera;

void main(void)
{
    V_Vertex.Position = (object.ModelViewMatrix * vec4(A_Position, 1.0)).xyz;    
    V_Vertex.Normal = normalize(object.NormalMatrix * A_Normal);
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour.rgb;

    gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * vec4(V_Vertex.Position, 1.0);
}
`;

export const cubeShaderFrag = `#version 300 es
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
}
`;

export const finalPassShaderVert = `#version 300 es
#pragma vscode_glsllint_stage: vert

layout(location = 0) in vec2 A_Position;
out vec2 V_UV;

void main(void)
{
    V_UV = A_Position * 0.5 + 0.5;
    gl_Position = vec4(A_Position, 0.0, 1.0);
}
`

export const finalPassShaderFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision highp float;
layout (std140) uniform;

in vec2 V_UV;
layout(location = 0) out vec4 O_FragColour;

uniform sampler2D U_Position;
uniform sampler2D U_Normal;
uniform sampler2D U_Albedo_Alpha;
uniform sampler2D U_Depth;

struct Fragment
{
    vec3 Position;
    vec3 Normal;
    vec3 Diffuse;
    float Alpha;
    float Depth;
} fragment;
void main(void)
{
    fragment = Fragment(
        texture(U_Position, V_UV).rgb,
        texture(U_Normal, V_UV).rgb,
        texture(U_Albedo_Alpha, V_UV).rgb,
        texture(U_Albedo_Alpha, V_UV).a,
        texture(U_Depth, V_UV).r
    );

    // O_FragColour = vec4(fragment.Position, 1.0);
    // O_FragColour = vec4(fragment.Normal, 1.0);
    // O_FragColour = vec4(fragment.Diffuse, 1.0);
    O_FragColour = vec4(fragment.Diffuse, fragment.Alpha);
    // O_FragColour = vec4(vec3(fragment.Alpha), 1.0);
    // O_FragColour = vec4(fragment.Depth);
}
`