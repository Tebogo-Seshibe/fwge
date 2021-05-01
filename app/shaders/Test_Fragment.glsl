#ifdef GL_VERTEX_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
    precision mediump int;

varying vec4 V_Colour;
varying vec3 V_Normal;
varying vec2 V_UV;

void main()
{
    gl_FragColor = V_Colour;
}