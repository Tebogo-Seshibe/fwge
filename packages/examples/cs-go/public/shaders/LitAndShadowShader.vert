#version 300 es
//#include _lighting.vert
//#include constants.vert

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

out vec3 V_Position;
out vec3 V_Position_2;
out vec3 V_Normal;
out vec2 V_UV;
out vec3 V_Colour;
out vec4 V_LightPosition;

uniform DirectionalLight
{
    vec3 Colour;
    float Intensity;
    
    vec3 Direction;
    bool CastShadows;
    
    vec4 Data;
    // float TexelSize;
    // float TexelCount;
    // float Bias;
    // int PCFLevel;

    mat4 ShadowMatrix;
} directionalLight;

struct Matrix
{
    mat4 ModelView;
    mat3 Normal;
    mat4 View;
    mat4 Projection;
    mat4 DirectionalShadow;
};
uniform Matrix U_Matrix;

void main(void)
{
    vec4 position = U_Matrix.ModelView * vec4(A_Position, 1.0);
    V_Position = position.xyz;
    V_Position_2 = A_Position;
    V_Normal = normalize(U_Matrix.Normal * A_Normal);
    V_UV = A_UV;
    V_Colour = A_Colour;
    V_LightPosition = directionalLight.ShadowMatrix * position;

    gl_Position = U_Matrix.Projection * U_Matrix.View * position;
}
