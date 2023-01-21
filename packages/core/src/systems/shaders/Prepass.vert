#version 300 es
#pragma vscode_glsllint_stage: vert
layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

layout (std140) uniform;
precision highp float;

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
out Vertex V_Vertex;

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat3 Normal;
    mat4 Projection;
};
uniform Matrix U_Matrix;

// uniform Camera
// {
//     mat4 ViewMatrix;
//     mat4 ProjectionMatrix;
// } camera;

// uniform Globals
// {
//     mat4 ProjectionMatrix;
//     mat4 ViewMatrix;
//     mat4 ModelViewMatrix;
//     mat3 NormalMatrix;
// };

void main(void)
{
    vec4 position = U_Matrix.ModelView * vec4(A_Position, 1.0);

    V_Vertex.Position = position.xyz;
    V_Vertex.Normal = U_Matrix.Normal * A_Normal;
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour;

    // gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * position;
    gl_Position = U_Matrix.Projection * U_Matrix.View * position;
}