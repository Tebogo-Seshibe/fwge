#version 300 es
#pragma vscode_glsllint_stage: vert

//#include its_a_potato

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

uniform Transform
{
    mat4 Model;
    mat3 Normal;
} transform;

uniform Camera
{
    mat4 View;
    mat4 Projection;
    vec3 Position;
} camera;

void main(void)
{
    V_Vertex.Position = (transform.Model * vec4(A_Position, 1.0)).xyz;
    V_Vertex.Normal = normalize(transform.Normal * A_Normal);
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour.rgb;
    
    gl_Position = camera.Projection * camera.View * vec4(V_Vertex.Position, 1.0);
}
