#version 300 es

layout (std140) uniform;
precision highp float;

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

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
    V_Vertex.Colour = A_Colour;

    gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * vec4(V_Vertex.Position, 1.0);
}
