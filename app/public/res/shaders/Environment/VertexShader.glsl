attribute vec3 aVertexPosition;
attribute vec2 aVertexUV;
attribute vec4 aVertexColour;
attribute vec3 aVertexNormal;

uniform mat3 uNMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vVertexPosition;
varying vec2 vVertexUV;
varying vec3 vNormalVector;
varying vec4 vVertexColour;
varying vec4 vShadowPosition;

void main(void)
{
	vVertexColour = aVertexColour;
	vVertexUV = aVertexUV;

	vVertexPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
	vNormalVector = uNMatrix * aVertexNormal;

	vShadowPosition = mat4
	(
		0.5, 0.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 0.0,
		0.0, 0.0, 0.5, 0.0,
		0.5, 0.5, 0.5, 1.0
	) * vec4(aVertexPosition, 1.0);
	
	gl_Position = uPMatrix * vVertexPosition;
}