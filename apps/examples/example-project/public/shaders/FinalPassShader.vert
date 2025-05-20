#version 300 es
#pragma vscode_glsllint_stage: vert

layout(location = 0) in vec2 A_Position;
out vec2 V_UV;

void main(void)
{
    V_UV = A_Position * 0.5 + 0.5;
    gl_Position = vec4(A_Position, 0.0, 1.0);
}
