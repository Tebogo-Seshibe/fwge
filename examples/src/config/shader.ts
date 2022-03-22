import { Entity, Game } from "@fwge/core"
import { Attribute, Colour4, DynamicMesh, Material, Mesh, Shader, StaticMesh, Uniform } from "@fwge/render"
import { ShaderBool, ShaderFloat, ShaderVec2, ShaderVec3, ShaderVec4 } from "@fwge/render/lib/components/shader/types/Types"

export function configureShaders(game: Game): void
{
    const shaderLibrary = game.GetLibrary(Shader)

    shaderLibrary.Add(
        'Simple',
        new Shader(
            `#version 300 es
            in vec3 A_Position;

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
            
            `#version 300 es
            precision mediump float;

            uniform vec4 colour;
            out vec4 FragColor;
            void main(void)
            {
                FragColor = colour;
            }`,
            {
                
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920,
                attributes:
                [
                    new Attribute(
                        ShaderVec3, 'A_Position',
                        (entity: Entity) => {
                            const mesh = entity.GetComponent(Mesh)!
                            return (mesh as DynamicMesh).PositionBuffer!
                        }
                    ),
                ],
                uniforms:
                [
                    new Uniform(
                        ShaderVec4, 'colour',
                        (entity: Entity) => entity.GetComponent(Material)!.Diffuse
                    )
                ]
            }
        )
    )

    shaderLibrary.Add(
        'Basic',
        new Shader(
            `#version 300 es
            in vec3 A_Position;
            in vec4 A_Colour;

            struct Matrix
            {
                mat4 ModelView;
                mat4 Projection;
            };
            uniform Matrix U_Matrix;

            out vec4 V_Colour;
            void main(void)
            {
                V_Colour = A_Colour;
                gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
            }`,
            
            `#version 300 es
            precision mediump float;

            struct Global
            {
                int ObjectID;
                int ObjectCount;
            };
            uniform Global U_Global;

            in vec4 V_Colour;
            out vec4 FragColor;
            void main(void)
            {
                FragColor = V_Colour;
                // gl_FragColor = vec4(vec3(float(U_Global.ObjectID) / float(U_Global.ObjectCount)), 1.0);
            }`,
            {
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920,
                attributes:
                [
                    // new Attribute(
                    //     ShaderVec3, 'A_Position',
                    //     (entity: Entity) => entity.GetComponent(Mesh)!.PositionBuffer!
                    // ),
                    new Attribute(
                        ShaderVec4, 'A_Colour',
                        (entity: Entity) => {
                            const mesh = entity.GetComponent(Mesh)!
                            return (mesh as DynamicMesh).ColourBuffer!
                        }
                    ),
                ],
                uniforms:
                [
                ]
            }
        )
    )

    shaderLibrary.Add(
        'Default',
        new Shader(
            `#version 300 es
            precision mediump float;
            in vec3 A_Position;
            in vec2 A_UV;
            in vec4 A_Colour;
            in vec3 A_Normal;
            
            struct Matrix
            {
                mat3 Normal;
                mat4 ModelView;
                mat4 View;
                mat4 Projection;
            };
            uniform Matrix U_Matrix;
            
            out vec3 V_Position;
            out vec2 V_UV;
            out vec3 V_Normal;
            out vec4 V_Colour;
            out vec4 V_Shadow;
            
            void main(void)
            {
                vec4 Position = U_Matrix.ModelView * vec4(A_Position, 1.0);

                V_Position = Position.xyz;
                V_Colour = A_Colour;
                V_UV = A_UV;                
                V_Normal = U_Matrix.Normal * A_Normal;
                // V_Normal = normalize((U_Matrix.ModelView * vec4(A_Normal, 1.0)).xyz);
                
                gl_Position = U_Matrix.Projection * U_Matrix.View * Position;
            }`,
            `#version 300 es
            precision mediump float;
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
            
            in vec4 V_Colour;
            in vec2 V_UV;
            in vec3 V_Normal;
            in vec3 V_Position;
            in vec4 V_Shadow;
            out vec4 FragColor;
            
            vec4 CalcPointLight(in PointLight point)
            {                
                float falloff = smoothstep(point.Radius, 0.0, min(length(point.Position - V_Position), point.Radius));
                vec3 L = normalize(point.Position - V_Position);
                vec3 E = -V_Position;
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
                    ).rgb,  1.0);
                }
            
            vec4 Light()
            {
                vec4 light = vec4(0.0);
                
                light += CalcPointLight(U_Point[0]);
                light += CalcPointLight(U_Point[1]);
                light += CalcPointLight(U_Point[2]);

                return light;
            }
            
            vec4 Colour()
            {
                vec4 colour = V_Colour;

                if (U_Material.HasImageMap)
                {
                    colour *= texture(U_Sampler.Image, V_UV);
                }                
                
                return colour;
            }
            
            void main(void)
            { 
                vec4 colour = Colour() * Light();
                colour.a *= U_Material.Alpha;
                
                FragColor = colour;
            }`,
            {
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920,
                attributes:
                [
                    new Attribute(
                        ShaderVec3, 'A_Position',
                        (entity: Entity) => entity.GetComponent(Mesh)!.PositionBuffer!
                    ),
                    new Attribute(
                        ShaderVec2, 'A_UV',
                        (entity: Entity) => entity.GetComponent(Mesh)!.UVBuffer!
                    ),
                    new Attribute(
                        ShaderVec4, 'A_Colour',
                        (entity: Entity) => entity.GetComponent(Mesh)!.ColourBuffer!
                    ),
                    new Attribute(
                        ShaderVec4, 'A_Normal',
                        (entity: Entity) => entity.GetComponent(Mesh)!.NormalBuffer!
                    ),
                    new Attribute(
                        ShaderVec4, 'A_Normal',
                        (entity: Entity) => entity.GetComponent(Mesh)!.NormalBuffer!
                    ),
                ],
                uniforms:
                [
                    
                    new Uniform(
                        ShaderVec4, 'U_Material.Ambient',
                        (entity: Entity) => entity.GetComponent(Material)!.Ambient
                    ),
                    new Uniform(
                        ShaderVec4, 'U_Material.Diffuse',
                        (entity: Entity) => entity.GetComponent(Material)!.Diffuse
                    ),
                    new Uniform(
                        ShaderVec4, 'U_Material.Specular',
                        (entity: Entity) => entity.GetComponent(Material)!.Specular
                    ),
                    new Uniform(
                        ShaderFloat, 'U_Material.Shininess',
                        (entity: Entity) => entity.GetComponent(Material)!.Shininess
                    ),
                    new Uniform(
                        ShaderFloat, 'U_Material.Alpha',
                        (entity: Entity) => entity.GetComponent(Material)!.Alpha
                    ),
                    new Uniform(
                        ShaderBool, 'U_Material.HasImageMap',
                        (entity: Entity) => entity.GetComponent(Material)!.HasImageMap
                    ),
                    new Uniform(
                        ShaderBool, 'U_Material.HasBumpMap',
                        (entity: Entity) => entity.GetComponent(Material)!.HasImageMap
                    ),
                ]
            }
        )
    )
}
