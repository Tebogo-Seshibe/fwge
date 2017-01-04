attribute vec3 A_Position;
attribute vec3 A_Colour;

struct Matrix
{
    mat4 ModelView;
    mat4 Projection;
};
uniform Matrix U_Matrix;

varying vec3 V_Colour;

void main(void)
{
    V_Colour = A_Colour;
    gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
}