#version 300 es

layout(location = 0) in vec4 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec4 A_Colour;

out vec4 V_Position;
out vec3 V_Normal;
out vec2 V_UV;
out vec4 V_Colour;
out vec4 V_LightPosition;

struct Inner
{
    float age;
};

struct Outer
{
    Inner inner;
};
uniform Outer outer;

struct Matrix
{
    mat4 ModelView;
    mat3 Normal;
    mat4 View;
    mat4 Projection;
};
uniform Matrix U_Matrix;

uniform mat4 U_LightSpaceMatrix;
uniform mat4 U_LightSpaceMatrixs[4];

void main(void)
{
    V_Position = U_Matrix.ModelView * A_Position;
    V_Normal = U_Matrix.Normal * A_Normal;
    V_UV = A_UV;
    V_Colour = A_Colour;
    V_LightPosition = U_LightSpaceMatrix * V_Position;

    V_Position.y += outer.inner.age;

    gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
    gl_PointSize = 5.0;
}
