import { Shader } from "@fwge/core";

export class GridShader extends Shader
{
    constructor()
    {
        super(
            `#version 300 es

            layout (std140) uniform;
            precision highp float;

            layout(location = 0) in vec3 A_Position;
            layout(location = 3) in vec4 A_Colour;

            struct Vertex
            {
                vec3 Position;
                vec3 Colour;
            };
            out Vertex V_Vertex;

            uniform Object
            {
                mat4 ModelViewMatrix;
                mat3 NormalMatrix;
            } object;

            uniform Camera
            {
                mat4 ViewMatrix;
                mat4 ProjectionMatrix;
            } camera;

            void main(void)
            {
                V_Vertex.Position = (object.ModelViewMatrix * vec4(A_Position, 1.0)).xyz;    
                V_Vertex.Colour = A_Colour.rgb;

                gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * vec4(V_Vertex.Position, 1.0);
                gl_PointSize = 10.0f;
            }`,
            `#version 300 es

            precision highp float;

            layout(location = 0) out vec4 O_FragColour;

            struct Vertex
            {
                vec3 Position;
                vec3 Colour;
            };
            in Vertex V_Vertex;

            uniform BasicLitMaterial
            {
                vec3 Colour;
                float Shininess;
                float Alpha;

                vec3 Ambient;
                vec3 Diffuse;
                vec3 Specular;

                bool HasImageMap;
                bool HasBumpMap;
                bool ReceiveShadows;
            } basicLitMaterial;

            void main(void)
            {
                O_FragColour = vec4(V_Vertex.Colour, 1.0);
            }
            `
        );
    }
}
