attribute vec3 A_Position;
attribute vec3 A_Colour;
attribute vec3 A_Normal;
attribute vec2 A_UV;

struct Matrix
{
    mat4 ModelView;
    mat4 Projection;
    mat3 Normal;
	mat4 Camera;
};
uniform Matrix U_Matrix;

varying vec4 V_Position;
varying vec3 V_Normal;
varying vec2 V_UV;
varying vec3 V_Colour;

void main(void)
{
    V_Position = U_Matrix.ModelView * vec4(A_Position, 1.0);
    V_Normal = U_Matrix.Normal * A_Normal;
    V_Colour = A_Colour;
    V_UV = vec2(A_UV.s, 1.0 - A_UV.t);

    gl_Position = U_Matrix.Projection * V_Position;
    gl_PointSize = 50.0;
}
