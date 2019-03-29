attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;

uniform mat4 uPMatrix;
varying vec2 vVertexUV;

void main(void)
{
	vVertexUV = aVertexUV;
	gl_Position = vec4(aVertexPosition, 1.0);
}