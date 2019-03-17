precision mediump float;

struct Material 
{
    vec4 Diffuse;
};
uniform Material U_Material;

void main(void)
{
    gl_FragColor = vec4(U_Material.Diffuse);
}