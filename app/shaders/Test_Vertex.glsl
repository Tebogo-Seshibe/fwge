#ifdef GL_VERTEX_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
    precision mediump int;

attribute vec3 A_Position;
attribute vec4 A_Colour;
attribute vec3 A_Normal;
attribute vec2 A_UV;

struct Matrix
{
    mat4 Model;
    mat4 Projection;
    mat4 Camera;
    mat3 Normal;
};

uniform Matrix U_Matrix;

varying vec4 V_Colour;
varying vec3 V_Normal;
varying vec2 V_UV;

void main()
{
    V_Colour = A_Colour;
    V_Normal = U_Matrix.Normal * A_Normal;
    V_UV = A_UV;

    gl_Position = U_Matrix.Projection * U_Matrix.Model * vec4(A_Position, 1.0);
}