precision mediump float;

uniform int U_Sampler_Count;
uniform sampler2D U_Samplers[8];

varying vec2 V_UV;

void main(void)
{
    for (int i = 0; i < U_Sampler_Count; ++i)
        gl_FragColor *= texture2D(U_Samplers[i], V_UV);
}