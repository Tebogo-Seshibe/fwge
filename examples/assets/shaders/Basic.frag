#version 300 es
precision mediump float;

struct Global
{
    int ObjectID;
    int ObjectCount;
};
uniform Global U_Global;

in vec4 V_Colour;
out vec4 FragColor;
void main(void)
{
    FragColor = V_Colour;
    // gl_FragColor = vec4(vec3(float(U_Global.ObjectID) / float(U_Global.ObjectCount)), 1.0);
}
