attribute vec3 A_Position;
attribute vec2 A_UV;
attribute vec4 A_Colour;
attribute vec3 A_Normal;

struct Matrix
{
    mat3 Normal;
    mat4 ModelView;
    mat4 Projection;
};
uniform Matrix U_Matrix;

varying vec4 V_Position;
varying vec2 V_UV;
varying vec3 V_Normal;
varying vec4 V_Colour;
varying vec4 V_Shadow;

void main(void)
{
    V_Colour = A_Colour;
    V_UV = A_UV;
    
    V_Position = U_Matrix.ModelView * vec4(A_Position, 1.0);
    V_Normal = U_Matrix.Normal * A_Normal;
    
    V_Shadow = mat4(0.5, 0.0, 0.0, 0.0,
                     0.0, 0.5, 0.0, 0.0,
                     0.0, 0.0, 0.5, 0.0,
                     0.5, 0.5, 0.5, 1.0) * vec4(A_Position, 1.0);
    
    gl_Position = U_Matrix.Projection * V_Position;
}