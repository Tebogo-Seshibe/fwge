attribute vec3 A_Position;

struct Matrix
{
    mat4 ModelView;
    mat4 Projection;
};
uniform Matrix U_Matrix;

void main(void)
{
    gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
}