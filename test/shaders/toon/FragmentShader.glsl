precision mediump float;

varying vec3 V_Colour;

vec3 Effect(in vec3 colour)
{
	return vec3
	(
		colour.r > 0.00 ? (colour.r > 0.25 ? (colour.r > 0.50 ? (colour.r > 0.75 ? 1.0 : 0.75) : 0.50) : 0.25) : 0.00,
		colour.g > 0.00 ? (colour.g > 0.25 ? (colour.g > 0.50 ? (colour.g > 0.75 ? 1.0 : 0.75) : 0.50) : 0.25) : 0.00,
		colour.b > 0.00 ? (colour.b > 0.25 ? (colour.b > 0.50 ? (colour.b > 0.75 ? 1.0 : 0.75) : 0.50) : 0.25) : 0.00
	);
}

void main(void)
{    
   	gl_FragColor = vec4(V_Colour, 1.0);
}