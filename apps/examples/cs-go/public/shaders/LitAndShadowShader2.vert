#version 300 es

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

out vec3 V_Position;
out vec3 V_Normal;
out vec2 V_UV;
out vec3 V_Colour;

struct Matrix
{
    mat4 ModelView;
    mat3 Normal;
    mat4 View;
    mat4 Projection;
};
uniform Matrix U_Matrix;

uniform mat4 U_LightSpaceMatrix;

void main(void)
{
    V_Position = (U_Matrix.ModelView * vec4(A_Position, 1.0)).xyz;
    V_Normal = normalize(U_Matrix.Normal * A_Normal);
    V_UV = A_UV;
    V_Colour = A_Colour;

    gl_Position = U_Matrix.Projection * U_Matrix.View * vec4(V_Position, 1.0);
}
