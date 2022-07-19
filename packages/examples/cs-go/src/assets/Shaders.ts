import { ShaderAsset } from "@fwge/render"

export const basicShader = () => new ShaderAsset(
{
    vertexShader:
    {
        source: `#version 300 es

        layout(location = 0) in vec4 A_Position;
        layout(location = 1) in vec3 A_Normal;
        layout(location = 2) in vec2 A_UV;
        layout(location = 3) in vec4 A_Colour;
        layout(location = 4) in mat4 A_ModelViewMatrix;
        layout(location = 8) in mat3 A_NormalMatrix;

        out vec4 V_Position;
        out vec3 V_Normal;
        out vec2 V_UV;
        out vec4 V_Colour;

        struct Matrix
        {
            mat4 ModelView;
            mat4 View;
            mat4 Projection;
        };
        uniform Matrix U_Matrix;

        void passVertexData()
        {
            V_Position = U_Matrix.ModelView * A_Position;
            V_Normal = A_Normal;
            V_UV = A_UV;
            V_Colour = A_Colour;
        }
        
        void main(void)
        {
            passVertexData();
        
            gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
            gl_PointSize = 5.0;
        }
        `,
        input: []
    },
    fragmentShader:
    {
        source: `#version 300 es
        precision highp float;
        
        in vec4 V_Position;
        in vec3 V_Normal;
        in vec2 V_UV;
        in vec4 V_Colour;
        
        layout(location = 0) out vec4 O_FragColour;            
                            
        struct Material 
        {
            vec4 Ambient;
            vec4 Diffuse;
            vec4 Specular;
            float Shininess;
            float Alpha;

            bool HasImageMap;
            bool HasBumpMap;
        };
        
        struct PointLight
        { 
            vec4 Colour;
            float Intensity;

            vec3 Position;
            float Radius;
            float Angle;
        };

        uniform PointLight U_PointLight[4];
        uniform Material U_Material;

        vec4 CalcPointLight(in PointLight point)
        {                
            float falloff = smoothstep(point.Radius, 0.0, min(length(point.Position - V_Position.xyz), point.Radius));
            vec3 L = normalize(point.Position - V_Position.xyz);
            vec3 E = -V_Position.xyz;
            vec3 N = V_Normal;
        
            vec3 H = normalize(L + E);
            vec4 ambient = U_Material.Ambient;
        
            float Kd = max(dot(L, H), 0.0);
            vec4 diffuse = Kd * U_Material.Diffuse;
        
            float Ks = pow(max(dot(N, H), 0.0), U_Material.Shininess);
            vec4 specular = Ks * U_Material.Specular;
        
            if (dot(L, H) < 0.0)
            {
                specular = vec4(vec3(0.0), 1.0);
            }

            return vec4(
            (
                (ambient + diffuse + specular)
                * point.Colour
                * point.Intensity
                * falloff
                ).rgb,
            1.0);
        }
        
        vec4 PointLightColour()
        {
            return 
                CalcPointLight(U_PointLight[0]) +
                CalcPointLight(U_PointLight[1]) +
                CalcPointLight(U_PointLight[2]) +
                CalcPointLight(U_PointLight[3]);
        }

        void main(void)
        {
            O_FragColour = PointLightColour() * V_Colour * vec4(U_Material.Ambient.rgb, U_Material.Alpha);
        }
        `,
        input: []
    }
})