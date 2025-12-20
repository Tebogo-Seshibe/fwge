import { Shader, ShaderAsset } from "@fwge/core";

export class CubeShaderAsset extends ShaderAsset
{
    constructor()
    {
        super(
            './public/shaders/CubeShader.vert',
            './public/shaders/CubeShader.frag',
            'Cube Shader'
        )
    }
}

export class CubeShader extends Shader
{
    constructor()
    {
        super(
            `#version 300 es
            #pragma vscode_glsllint_stage: vert

            //#include its_a_potato

            layout (std140) uniform;
            precision highp float;

            layout(location = 0) in vec3 A_Position;
            layout(location = 1) in vec3 A_Normal;
            layout(location = 2) in vec2 A_UV;
            layout(location = 3) in vec4 A_Colour;

            struct Vertex
            {
                vec3 Position;
                vec3 Normal;
                vec2 UV;
                vec3 Colour;
            };
            out Vertex V_Vertex;

            uniform Transform
            {
                mat4 Model;
                mat3 Normal;
            } transform;

            uniform Camera
            {
                mat4 View;
                mat4 Projection;
                vec3 Position;
            } camera;

            void main(void)
            {
                V_Vertex.Position = (transform.Model * vec4(A_Position, 1.0)).xyz;
                V_Vertex.Normal = normalize(transform.Normal * A_Normal);
                V_Vertex.UV = A_UV;
                V_Vertex.Colour = A_Colour.rgb;
                
                gl_Position = camera.Projection * camera.View * vec4(V_Vertex.Position, 1.0);
            }`,
            `#version 300 es
            #pragma vscode_glsllint_stage: frag

            precision highp float;
            precision highp sampler2D;

            layout (std140) uniform;
            layout(location = 0) out vec3 O_Position;
            layout(location = 1) out vec3 O_Normal;
            layout(location = 2) out vec4 O_Albedo_Alpha;

            struct Vertex
            {
                vec3 Position;
                vec3 Normal;
                vec2 UV;
                vec3 Colour;
            };
            in Vertex V_Vertex;

            struct Sampler
            {
                sampler2D Image;
                sampler2D Bump;
            };
            uniform Sampler U_Sampler;

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
                vec4 tex = texture(U_Sampler.Image, V_Vertex.UV);
                vec3 albedo = basicLitMaterial.Colour * tex.rgb * V_Vertex.Colour;
                float alpha = basicLitMaterial.Alpha * tex.a;

                O_Position = V_Vertex.Position;
                O_Normal = normalize(V_Vertex.Normal * texture(U_Sampler.Bump, V_Vertex.UV).xyz);
                O_Albedo_Alpha = vec4(albedo, alpha);
                
            }`
        );
    }
}
