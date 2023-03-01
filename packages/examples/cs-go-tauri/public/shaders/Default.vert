#version 300 es

//#include common.vert
//#include lighting.vert

void main(void)
{
    passVertexData();

    gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
}
