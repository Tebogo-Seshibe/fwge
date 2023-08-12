import { BasicLitMaterial, RenderType, Shader } from "@fwge/core"

export const createBasicMaterial = () => new BasicLitMaterial(
{
    alpha: 1.0,
    shininess: 32,
    renderType: RenderType.TRANSPARENT,
    shader: new Shader(
        `#version 300 es

        layout(location = 0) in vec3 A_Position;
        layout(location = 1) in vec3 A_Normal;
        layout(location = 2) in vec2 A_UV;
        layout(location = 3) in vec3 A_Colour;
        
        out vec3 V_Position;
        out vec3 V_Normal;
        out vec2 V_UV;
        out vec3 V_Colour;
        
        struct Matrix
        {
            mat4 ModelView;
            mat3 Normal;
            mat4 View;
            mat4 Projection;
        };
        uniform Matrix U_Matrix;
        
        uniform mat4 U_LightSpaceMatrix;
        
        void main(void)
        {
            V_Position = (U_Matrix.ModelView * vec4(A_Position, 1.0)).xyz;
            V_Normal = normalize(U_Matrix.Normal * A_Normal);
            V_UV = A_UV;
            V_Colour = A_Colour;
        
            gl_Position = U_Matrix.Projection * U_Matrix.View * vec4(V_Position, 1.0);
        }        
        `,
        
        `#version 300 es

        precision highp float;
        precision highp sampler2D;
        
        in vec3 V_Position;
        in vec3 V_Normal;
        in vec2 V_UV;
        in vec3 V_Colour;
        
        layout(location = 0) out vec4 O_DiffuseSpecular;
        layout(location = 1) out vec3 O_Position;
        layout(location = 2) out vec3 O_Normal;
        
        struct Sampler
        {
            sampler2D Image;
            sampler2D Bump;
        };
        uniform Sampler U_Sampler;
        
        void main(void)
        {
            O_DiffuseSpecular = vec4(V_Colour, 1.0) * texture(U_Sampler.Image, V_UV);
            O_Position = V_Position;
            O_Normal = normalize(V_Normal * texture(U_Sampler.Bump, V_UV).xyz);
        }        
        `
    ),
});
