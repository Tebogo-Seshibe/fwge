import { Game } from "@fwge/core"
import { Colour4, Shader } from "@fwge/render"

export function configureShaders(game: Game): void
{
    const shaderLibrary = game.GetLibrary(Shader)

    shaderLibrary.Add(
        'Basic',
        new Shader(
            `attribute vec3 A_Position;

            struct Matrix
            {
                mat4 ModelView;
                mat4 Projection;
            };
            uniform Matrix U_Matrix;

            void main(void)
            {
                gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
            }`,
            
            `precision mediump float;

            struct Global
            {
                int ObjectID;
                int ObjectCount;
            };
            uniform Global U_Global;

            void main(void)
            {
                gl_FragColor = vec4(vec3(float(U_Global.ObjectID) / float(U_Global.ObjectCount)), 1.0);
            }`,
            {
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920
            }
        )
    )

    shaderLibrary.Add(
        'Default',
        new Shader(
            `attribute vec3 A_Position;
            attribute vec2 A_UV;
            attribute vec4 A_Colour;
            attribute vec3 A_Normal;
            
            struct Matrix
            {
                mat3 Normal;
                mat4 ModelView;
                mat4 Projection;
            };
            uniform Matrix U_Matrix;
            
            varying vec4 V_Position;
            varying vec2 V_UV;
            varying vec3 V_Normal;
            varying vec4 V_Colour;
            varying vec4 V_Shadow;
            
            void main(void)
            {
                V_Colour = A_Colour;
                V_UV = A_UV;
                
                V_Position = U_Matrix.ModelView * vec4(A_Position, 1.0);
                V_Normal = U_Matrix.Normal * A_Normal;
                
                V_Shadow = mat4(0.5, 0.0, 0.0, 0.0,
                                0.0, 0.5, 0.0, 0.0,
                                0.0, 0.0, 0.5, 0.0,
                                0.5, 0.5, 0.5, 1.0) * vec4(A_Position, 1.0);
                
                gl_Position = U_Matrix.Projection * V_Position;
            }`,
            `precision mediump float;
            const int MAX_LIGHTS = 4;
            
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
            uniform Material U_Material;
            
            struct AmbientLight 
            {
                vec4 Colour;
                float Intensity;
            };
            uniform AmbientLight U_Ambient;
            
            struct DirectionalLight
            {
                vec3 Direction;
                vec4 Colour;
                float Intensity;
            };
            uniform DirectionalLight U_Directional;
            
            struct PointLight
            { 
                vec3 Position;
                vec4 Colour;
                float Intensity;
                float Radius;
                float Angle;
            };
            uniform PointLight U_Point[MAX_LIGHTS];
            uniform int U_Point_Count;
            
            struct Sampler
            {
                sampler2D Image;
                sampler2D Bump;
                sampler2D Shadow;
            };
            uniform Sampler U_Sampler;
            
            varying vec4 V_Colour;
            varying vec2 V_UV;
            varying vec3 V_Normal;
            varying vec4 V_Position;
            varying vec4 V_Shadow;
            
            vec4 Ambient()
            {
                return U_Material.Ambient * U_Ambient.Colour * U_Ambient.Intensity;
            }
            
            vec4 Directional(in vec3 normal) 
            { 
                float weight = max(dot(normal, normalize(U_Directional.Direction)), 0.0);
                vec4 diffuse = U_Directional.Colour * weight;
                
                return U_Material.Diffuse * diffuse * U_Directional.Intensity;
            } 
            
            vec4 Point(in vec3 normal)
            {
                vec4 points = vec4(0.0);
            
                for (int i = 0; i < MAX_LIGHTS; ++i)
                {
                    if (i < U_Point_Count)
                    {
                        PointLight point = U_Point[i];
                        float distance = length(point.Position - V_Position.xyz);
            
                        if (distance <= point.Radius)
                        {
                            vec4 colour = vec4(0.0);
                            vec3 direction = normalize(point.Position - V_Position.xyz);
                            vec3 eyeVector = normalize(-normal.xyz);
                            vec3 reflection = reflect(direction, normal);
                            
                            float diffuse_weight = max(dot(normal, direction), 0.0);
                            float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_Material.Shininess);
            
                            colour = U_Material.Diffuse * point.Colour * diffuse_weight + U_Material.Specular * specular_weight;
                            colour = colour * (1.0 - (distance / point.Radius));
                            colour = colour * point.Intensity;
                            points += colour;
                        } 
                    } 
                    else break;
                } 
                
                return points;
            }
            
            vec4 Light()
            {
                vec3 normal = normalize(U_Material.HasBumpMap
                                        ? texture2D(U_Sampler.Bump, V_UV).xyz * V_Normal
                                        : V_Normal);
            
                                        return vec4(1.0);
                // return Ambient() + Directional(normal) + Point(normal);
            }
            
            vec4 Shadow()
            {                
                return vec4(1.0);
            }
            
            vec4 Colour()
            {
                vec4 colour = Shadow();
                
                if (U_Material.HasImageMap)
                    colour = texture2D(U_Sampler.Image, V_UV);
                else
                    colour = vec4(1.0);
                
                return colour;
            }
            
            void main(void)
            { 
                vec4 colour = Colour() * Light();
                colour.a *= U_Material.Alpha;
                
                // gl_FragColor = vec4(1.0,0.0,0.0,1.0);
                gl_FragColor = colour;
            }`
        )
    )
}
