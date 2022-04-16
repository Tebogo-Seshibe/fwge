#version 300 es

// common.vert
// lighting.vert

void main(void)
{
    passVertexData();

    gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
}
