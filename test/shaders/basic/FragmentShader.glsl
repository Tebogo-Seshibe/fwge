precision mediump float;

varying vec3 V_Colour;

void main(void)
{    
   	gl_FragColor = vec4(V_Colour, 1.0);
}