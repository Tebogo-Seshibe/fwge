precision mediump float;

const int SAMPLES = 16;

uniform int uSamplerCount;
uniform sampler2D uSampler[SAMPLES];

varying vec2 vVertexUV;

void main(void)
{
    vec4 colour = vec4(0.0);
    int length = uSamplerCount;
    
    for (int i = 0; i < SAMPLES; ++i)
    {
        colour += (i < uSamplerCount) ? texture2D(uSampler[i], vVertexUV) : vec4(0.0);
    }
    
    gl_FragColor = colour;
}