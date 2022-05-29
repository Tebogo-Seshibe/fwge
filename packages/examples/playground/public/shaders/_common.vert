layout(location = 0) in vec4 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec4 A_Colour;
layout(location = 4) in mat4 A_ModelViewMatrix;
layout(location = 8) in mat3 A_NormalMatrix;

out vec4 V_Position;
out vec3 V_Normal;
out vec2 V_UV;
out vec4 V_Colour;

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat4 Projection;
};
uniform Matrix U_Matrix;

void passVertexData()
{
    V_Position = U_Matrix.ModelView * A_Position;
    V_Normal = A_Normal;
    V_UV = A_UV;
    V_Colour = A_Colour;
}