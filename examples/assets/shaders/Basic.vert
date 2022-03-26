#version 300 es
in vec3 A_Position;
in vec4 A_Colour;

struct Matrix
{
    mat4 ModelView;
    mat4 Projection;
};
uniform Matrix U_Matrix;

out vec4 V_Colour;
void main(void)
{
    V_Colour = A_Colour;
    gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
}
