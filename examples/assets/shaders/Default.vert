#version 300 es
precision mediump float;
in vec3 A_Position;
in vec2 A_UV;
in vec4 A_Colour;
in vec3 A_Normal;

struct Matrix
{
  mat3 Normal;
  mat4 ModelView;
  mat4 View;
  mat4 Projection;
};
uniform Matrix U_Matrix;

out vec3 V_Position;
out vec2 V_UV;
out vec3 V_Normal;
out vec4 V_Colour;
out vec4 V_Shadow;

void main(void)
{
  vec4 Position = U_Matrix.ModelView * vec4(A_Position, 1.0);

  V_Position = Position.xyz;
  V_Colour = A_Colour;
  V_UV = A_UV;                
  V_Normal = U_Matrix.Normal * A_Normal;
  // V_Normal = normalize((U_Matrix.ModelView * vec4(A_Normal, 1.0)).xyz);
  
  gl_Position = U_Matrix.Projection * U_Matrix.View * Position;
}
