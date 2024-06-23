import { GL, Maths, Matrix3, Matrix4, Vector3 } from "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/common/lib/index";
import { Entity, Registry, System } from "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/ecs/lib/index";
import { AreaLight, BasicLitMaterial, Camera, DefaultWindow, DirectionalLight, Game, InstanceMesh, Light, Material, MeshRenderer, PerspectiveCamera, RenderMode, Renderer, Scene, Script, ScriptSystem, Shader, StaticMesh, Tag, Transform } from "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/core/lib/index";
import { ButtonState, Input, InputSystem, KeyState, WheelState } from "/@fs/D:/Projects/Personal/@fwge/apps/examples/example-project/node_modules/@fwge/input/lib/index";


class Project extends Game {
    constructor() {
        super({
            scenes: [
                EditorScene,
                Scene1,
            ],
            startupScene: 0,
            height: 1080,
            width: 1920,
        });
    }
}


class CubeMesh extends StaticMesh {
    constructor() {
        super({
            name: 'Cube Mesh',
            position: [
                [-0.5, 0.5, 0.5],
                [-0.5, -0.5, 0.5],
                [0.5, -0.5, 0.5],
                [0.5, 0.5, 0.5],
                [0.5, 0.5, 0.5],
                [0.5, -0.5, 0.5],
                [0.5, -0.5, -0.5],
                [0.5, 0.5, -0.5],
                [0.5, 0.5, -0.5],
                [0.5, -0.5, -0.5],
                [-0.5, -0.5, -0.5],
                [-0.5, 0.5, -0.5],
                [-0.5, 0.5, -0.5],
                [-0.5, -0.5, -0.5],
                [-0.5, -0.5, 0.5],
                [-0.5, 0.5, 0.5],
                [-0.5, 0.5, -0.5],
                [-0.5, 0.5, 0.5],
                [0.5, 0.5, 0.5],
                [0.5, 0.5, -0.5],
                [-0.5, -0.5, 0.5],
                [-0.5, -0.5, -0.5],
                [0.5, -0.5, -0.5],
                [0.5, -0.5, 0.5],
            ],
            normal: [
                [0.0, 0.0, 1.0],
                [0.0, 0.0, 1.0],
                [0.0, 0.0, 1.0],
                [0.0, 0.0, 1.0],
                [1.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 0.0, -1.0],
                [0.0, 0.0, -1.0],
                [0.0, 0.0, -1.0],
                [0.0, 0.0, -1.0],
                [-1.0, 0.0, 0.0],
                [-1.0, 0.0, 0.0],
                [-1.0, 0.0, 0.0],
                [-1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, -1.0, 0.0],
                [0.0, -1.0, 0.0],
                [0.0, -1.0, 0.0],
                [0.0, -1.0, 0.0],
            ],
            colour: [
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, 1.0, 1.0],
            ],
            uv: [
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
            ],
            index: [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23,
            ]
        });
    }
}


class CubeShader extends Shader {
    constructor() {
        super(`#version 300 es
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
            }`, `#version 300 es
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
            }`);
    }
}
export class FinalPassShader extends Shader {
    constructor() {
        super(`#version 300 es
            #pragma vscode_glsllint_stage: vert

            layout(location = 0) in vec2 A_Position;
            out vec2 V_UV;

            void main(void)
            {
                V_UV = A_Position * 0.5 + 0.5;
                gl_Position = vec4(A_Position, 0.0, 1.0);
            }
            `, `#version 300 es
            #pragma vscode_glsllint_stage: frag

            precision highp float;
            layout (std140) uniform;

            in vec2 V_UV;
            layout(location = 0) out vec4 O_FragColour;

            uniform Camera
            {
                mat4 View;
                mat4 Projection;
                vec3 Position;
            } camera;

            struct Fragment
            {
                vec3 Position;
                vec3 Normal;
                vec3 Diffuse;
                float Alpha;
                float Depth;
            } fragment;
            uniform sampler2D U_Position;
            uniform sampler2D U_Normal;
            uniform sampler2D U_Albedo_Alpha;
            uniform sampler2D U_Depth;
            uniform sampler2D U_Dir_Tex;

            // Area Lighting ---------------------------------------
            struct AreaLight
            {
                vec3 Colour;
                float Intensity;
            };
            uniform AreaLight[1] U_AreaLight;

            vec3 CalcAreaLight(AreaLight light)
            {
                return light.Colour * light.Intensity;
            }
            // Area Lighting ---------------------------------------

            // Directional Lighting --------------------------------
            struct DirectionalLight
            {
                vec3 Colour;
                float Intensity;

                vec3 Direction;
                bool CastShadows;

                float TexelSize;
                float TexelCount;
                float Bias;
                float PCFLevel;

                mat4 ProjectionMatrix;
                mat4 ViewMatrix;
            };
            uniform DirectionalLight[1] U_DirectionalLight;

            float BasicShadowWeightDirectional(DirectionalLight dir, float diffuseDot, float specularDot, sampler2D shadowSampler, mat4 shadowMatrix)
            {
                vec4 shadowPosition = shadowMatrix * vec4(fragment.Position, 1.0);
                vec3 lightPosition = (shadowPosition.xyz / shadowPosition.w) * 0.5 + 0.5;
                vec2 fragUV = lightPosition.xy;
                float shadowDepth = texture(shadowSampler, fragUV).r;

                return 1.0;
            }

            float ShadowWeightDirectional(DirectionalLight dir, float diffuseDot, float specularDot, sampler2D shadowSampler, mat4 shadowMatrix)
            {
                vec4 shadowPosition = shadowMatrix * vec4(fragment.Position, 1.0);
                vec3 lightPosition = shadowPosition.xyz * 0.5 + 0.5;
                
                float bias = max(dir.Bias * (1.0 - diffuseDot), 0.0005);
                vec2 fragUV = lightPosition.xy;
                float fragmentDepth = lightPosition.z;

                if (fragmentDepth > 1.0)
                {
                    fragmentDepth = 1.0;
                }

                float total = 0.0;
                for (float x = -dir.PCFLevel; x <= dir.PCFLevel; ++x)
                {
                    for (float y = -dir.PCFLevel; y <= dir.PCFLevel; ++y)
                    {
                        vec2 offset = vec2(x, y) * dir.TexelSize;
                        vec2 uv = fragUV + offset;
                        if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0)
                        {
                            continue;
                        }

                        float shadowDepth = texture(shadowSampler, fragUV).r + bias;
                        if (shadowDepth < fragmentDepth)
                        {
                            total += 1.0;
                        }
                    }
                }

                // return 1.0;
                return total / dir.TexelCount;
            }

            vec3 CalcDirectionalLight(DirectionalLight light)
            {
                mat4 shadowMatrix = light.ProjectionMatrix * light.ViewMatrix;

                float diffuseInfluence = max(dot(fragment.Normal, light.Direction), 0.0);
                vec3 diffuse = light.Colour * diffuseInfluence * light.Intensity;

                // vec4 viewPosition = inverse(camera.Projection) * vec4(fragment.Position, 1.0);
                // vec3 halfway = normalize(light.Direction - viewPosition.xyz);
                // float specularInfluence = pow(max(dot(fragment.Normal, halfway), 0.0), 64.0);
                // vec3 specular = light.Colour * specularInfluence * light.Intensity;

                float shadow = ShadowWeightDirectional(light, diffuseInfluence, 1.0, U_Dir_Tex, shadowMatrix);

                return (diffuse) * (1.0 - shadow);
            }
            // Directional Lighting --------------------------------


            void main(void)
            {
                fragment = Fragment(
                    texture(U_Position, V_UV).rgb,
                    texture(U_Normal, V_UV).rgb,
                    texture(U_Albedo_Alpha, V_UV).rgb,
                    texture(U_Albedo_Alpha, V_UV).a,
                    texture(U_Depth, V_UV).r
                );

                vec3 light = vec3(0.0);
                vec3 area = vec3(0.0);
                vec3 dir = vec3(0.0);

                for (int i = 0; i < U_AreaLight.length(); ++i)
                {
                    area += CalcAreaLight(U_AreaLight[i]);
                }
                    
                for (int i = 0; i < U_DirectionalLight.length(); ++i)
                {
                    dir += CalcDirectionalLight(U_DirectionalLight[i]);
                }

                light = area + dir;
                
                // O_FragColour = vec4(fragment.Diffuse, fragment.Alpha);
                // O_FragColour = vec4(light, fragment.Alpha);
                // O_FragColour = vec4(vec3(texture(U_Dir_Tex, V_UV).r), fragment.Alpha);
                O_FragColour = vec4(fragment.Diffuse * light, fragment.Alpha);
            }`, 'Cube Shader');
    }
}


class CubeShader extends Shader {
    constructor() {
        super(`#version 300 es
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
            }`, `#version 300 es
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
            }`);
    }
}
export class FinalPassShader extends Shader {
    constructor() {
        super(`#version 300 es
            #pragma vscode_glsllint_stage: vert

            layout(location = 0) in vec2 A_Position;
            out vec2 V_UV;

            void main(void)
            {
                V_UV = A_Position * 0.5 + 0.5;
                gl_Position = vec4(A_Position, 0.0, 1.0);
            }
            `, `#version 300 es
            #pragma vscode_glsllint_stage: frag

            precision highp float;
            layout (std140) uniform;

            in vec2 V_UV;
            layout(location = 0) out vec4 O_FragColour;

            uniform Camera
            {
                mat4 View;
                mat4 Projection;
                vec3 Position;
            } camera;

            struct Fragment
            {
                vec3 Position;
                vec3 Normal;
                vec3 Diffuse;
                float Alpha;
                float Depth;
            } fragment;
            uniform sampler2D U_Position;
            uniform sampler2D U_Normal;
            uniform sampler2D U_Albedo_Alpha;
            uniform sampler2D U_Depth;
            uniform sampler2D U_Dir_Tex;

            // Area Lighting ---------------------------------------
            struct AreaLight
            {
                vec3 Colour;
                float Intensity;
            };
            uniform AreaLight[1] U_AreaLight;

            vec3 CalcAreaLight(AreaLight light)
            {
                return light.Colour * light.Intensity;
            }
            // Area Lighting ---------------------------------------

            // Directional Lighting --------------------------------
            struct DirectionalLight
            {
                vec3 Colour;
                float Intensity;

                vec3 Direction;
                bool CastShadows;

                float TexelSize;
                float TexelCount;
                float Bias;
                float PCFLevel;

                mat4 ProjectionMatrix;
                mat4 ViewMatrix;
            };
            uniform DirectionalLight[1] U_DirectionalLight;

            float BasicShadowWeightDirectional(DirectionalLight dir, float diffuseDot, float specularDot, sampler2D shadowSampler, mat4 shadowMatrix)
            {
                vec4 shadowPosition = shadowMatrix * vec4(fragment.Position, 1.0);
                vec3 lightPosition = (shadowPosition.xyz / shadowPosition.w) * 0.5 + 0.5;
                vec2 fragUV = lightPosition.xy;
                float shadowDepth = texture(shadowSampler, fragUV).r;

                return 1.0;
            }

            float ShadowWeightDirectional(DirectionalLight dir, float diffuseDot, float specularDot, sampler2D shadowSampler, mat4 shadowMatrix)
            {
                vec4 shadowPosition = shadowMatrix * vec4(fragment.Position, 1.0);
                vec3 lightPosition = shadowPosition.xyz * 0.5 + 0.5;
                
                float bias = max(dir.Bias * (1.0 - diffuseDot), 0.0005);
                vec2 fragUV = lightPosition.xy;
                float fragmentDepth = lightPosition.z;

                if (fragmentDepth > 1.0)
                {
                    fragmentDepth = 1.0;
                }

                float total = 0.0;
                for (float x = -dir.PCFLevel; x <= dir.PCFLevel; ++x)
                {
                    for (float y = -dir.PCFLevel; y <= dir.PCFLevel; ++y)
                    {
                        vec2 offset = vec2(x, y) * dir.TexelSize;
                        vec2 uv = fragUV + offset;
                        if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0)
                        {
                            continue;
                        }

                        float shadowDepth = texture(shadowSampler, fragUV).r + bias;
                        if (shadowDepth < fragmentDepth)
                        {
                            total += 1.0;
                        }
                    }
                }

                // return 1.0;
                return total / dir.TexelCount;
            }

            vec3 CalcDirectionalLight(DirectionalLight light)
            {
                mat4 shadowMatrix = light.ProjectionMatrix * light.ViewMatrix;

                float diffuseInfluence = max(dot(fragment.Normal, light.Direction), 0.0);
                vec3 diffuse = light.Colour * diffuseInfluence * light.Intensity;

                // vec4 viewPosition = inverse(camera.Projection) * vec4(fragment.Position, 1.0);
                // vec3 halfway = normalize(light.Direction - viewPosition.xyz);
                // float specularInfluence = pow(max(dot(fragment.Normal, halfway), 0.0), 64.0);
                // vec3 specular = light.Colour * specularInfluence * light.Intensity;

                float shadow = ShadowWeightDirectional(light, diffuseInfluence, 1.0, U_Dir_Tex, shadowMatrix);

                return (diffuse) * (1.0 - shadow);
            }
            // Directional Lighting --------------------------------


            void main(void)
            {
                fragment = Fragment(
                    texture(U_Position, V_UV).rgb,
                    texture(U_Normal, V_UV).rgb,
                    texture(U_Albedo_Alpha, V_UV).rgb,
                    texture(U_Albedo_Alpha, V_UV).a,
                    texture(U_Depth, V_UV).r
                );

                vec3 light = vec3(0.0);
                vec3 area = vec3(0.0);
                vec3 dir = vec3(0.0);

                for (int i = 0; i < U_AreaLight.length(); ++i)
                {
                    area += CalcAreaLight(U_AreaLight[i]);
                }
                    
                for (int i = 0; i < U_DirectionalLight.length(); ++i)
                {
                    dir += CalcDirectionalLight(U_DirectionalLight[i]);
                }

                light = area + dir;
                
                // O_FragColour = vec4(fragment.Diffuse, fragment.Alpha);
                // O_FragColour = vec4(light, fragment.Alpha);
                // O_FragColour = vec4(vec3(texture(U_Dir_Tex, V_UV).r), fragment.Alpha);
                O_FragColour = vec4(fragment.Diffuse * light, fragment.Alpha);
            }`, 'Cube Shader');
    }
}


class GridMesh extends StaticMesh {
    constructor() {
        super({
            position: [
                [100, 0, 0],
                [-100, 0, 0],
                [0, 100, 0],
                [0, -100, 0],
                [0, 0, 100],
                [0, 0, -100],
                [-10, 0, -10],
                [-10, 0, 10],
                [-9, 0, -10],
                [-9, 0, 10],
                [-8, 0, -10],
                [-8, 0, 10],
                [-7, 0, -10],
                [-7, 0, 10],
                [-6, 0, -10],
                [-6, 0, 10],
                [-5, 0, -10],
                [-5, 0, 10],
                [-4, 0, -10],
                [-4, 0, 10],
                [-3, 0, -10],
                [-3, 0, 10],
                [-2, 0, -10],
                [-2, 0, 10],
                [-1, 0, -10],
                [-1, 0, 10],
                [1, 0, -10],
                [1, 0, 10],
                [2, 0, -10],
                [2, 0, 10],
                [3, 0, -10],
                [3, 0, 10],
                [4, 0, -10],
                [4, 0, 10],
                [5, 0, -10],
                [5, 0, 10],
                [6, 0, -10],
                [6, 0, 10],
                [7, 0, -10],
                [7, 0, 10],
                [8, 0, -10],
                [8, 0, 10],
                [9, 0, -10],
                [9, 0, 10],
                [10, 0, -10],
                [10, 0, 10],
                [-10, 0, -10],
                [10, 0, -10],
                [-10, 0, -9],
                [10, 0, -9],
                [-10, 0, -8],
                [10, 0, -8],
                [-10, 0, -7],
                [10, 0, -7],
                [-10, 0, -6],
                [10, 0, -6],
                [-10, 0, -5],
                [10, 0, -5],
                [-10, 0, -4],
                [10, 0, -4],
                [-10, 0, -3],
                [10, 0, -3],
                [-10, 0, -2],
                [10, 0, -2],
                [-10, 0, -1],
                [10, 0, -1],
                [-10, 0, 1],
                [10, 0, 1],
                [-10, 0, 2],
                [10, 0, 2],
                [-10, 0, 3],
                [10, 0, 3],
                [-10, 0, 4],
                [10, 0, 4],
                [-10, 0, 5],
                [10, 0, 5],
                [-10, 0, 6],
                [10, 0, 6],
                [-10, 0, 7],
                [10, 0, 7],
                [-10, 0, 8],
                [10, 0, 8],
                [-10, 0, 9],
                [10, 0, 9],
                [-10, 0, 10],
                [10, 0, 10],
            ],
            colour: [
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 0, 1],
                [0, 1, 0, 1],
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 1, 1, 1],
            ]
        });
    }
}


class GridShader extends Shader {
    constructor() {
        super(`#version 300 es

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
            }`, `#version 300 es

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
            `);
    }
}


class EditorTag extends Tag {
    constructor() {
        super("Editor");
    }
}



class Camera extends Entity {
    Init() {
        this.AddComponents(new Transform({ position: [0, 0, 10] }), new PerspectiveCamera());
    }
}






class EditorViewer extends Entity {
    target = Vector3.Zero;
    up = Vector3.Zero;
    right = Vector3.Zero;
    forward = Vector3.Zero;
    movement = Vector3.Zero;
    rotationMatrix = Matrix3.Zero;
    zoomSpeed = 50;
    rotationSpeed = 25;
    panSpeed = 5;
    transform;
    cameraTransform;
    camera;
    locked = false;
    constructor() {
        super();
        this.camera = new PerspectiveCamera({ farClipping: 100 });
        this.cameraTransform = new Transform({ position: [0, 1, 0] });
        this.transform = new Transform({ position: [0, 0, 10] });
        this.AddChild(new Entity()
            .AddComponents(new EditorTag(), this.cameraTransform, this.camera));
        this.AddComponents(new EditorTag(), this.transform, new Input({
            onInput: (delta, keyboard, mouse) => {
                if (mouse.Wheel !== WheelState.CENTERED) {
                    const scrollAmount = mouse.Wheel === WheelState.UP
                        ? this.zoomSpeed
                        : -this.zoomSpeed;
                    this.Zoom(scrollAmount * delta);
                }
                if (mouse.Right === ButtonState.PRESSED) {
                    if (!this.locked) {
                        this.locked = true;
                        GL.canvas.requestPointerLock();
                    }
                    this.Rotate(mouse.Offset.X * delta * this.rotationSpeed, mouse.Offset.Y * delta * this.rotationSpeed);
                    this.Pan(delta, keyboard);
                }
                else {
                    if (this.locked) {
                        this.locked = false;
                        document.exitPointerLock();
                    }
                }
            },
        }));
    }
    Rotate(deltaTheta, deltaPhi) {
        this.cameraTransform.Rotation.X = Maths.clamp(this.cameraTransform.Rotation.X + deltaPhi, -80, 80);
        this.transform.Rotation.Y += deltaTheta;
    }
    Zoom(delta) {
        this.camera.FieldOfView -= delta;
    }
    Pan(delta, keyboard) {
        const wPressed = keyboard.KeyW !== KeyState.RELEASED && keyboard.KeyW !== KeyState.UP;
        const aPressed = keyboard.KeyA !== KeyState.RELEASED && keyboard.KeyA !== KeyState.UP;
        const sPressed = keyboard.KeyS !== KeyState.RELEASED && keyboard.KeyS !== KeyState.UP;
        const dPressed = keyboard.KeyD !== KeyState.RELEASED && keyboard.KeyD !== KeyState.UP;
        const qPressed = keyboard.KeyQ !== KeyState.RELEASED && keyboard.KeyQ !== KeyState.UP;
        const ePressed = keyboard.KeyE !== KeyState.RELEASED && keyboard.KeyE !== KeyState.UP;
        const shiftPressed = keyboard.KeyShift !== KeyState.RELEASED && keyboard.KeyShift !== KeyState.UP;
        const movementSpeed = this.panSpeed * (shiftPressed ? 2 : 1);
        this.rotationMatrix.Set(Matrix4.RotationMatrix(this.transform.Rotation).Matrix3);
        Matrix3.MultiplyVector(this.rotationMatrix, 0, 0, -1, this.forward);
        Matrix3.MultiplyVector(this.rotationMatrix, 1, 0, 0, this.right);
        if ((wPressed && sPressed) || (!wPressed && !sPressed)) {
            this.forward.Set(0, 0, 0);
        }
        else if (!wPressed && sPressed) {
            this.forward.Negate();
        }
        if ((dPressed && aPressed) || (!dPressed && !aPressed)) {
            this.right.Set(0, 0, 0);
        }
        else if (!dPressed && aPressed) {
            this.right.Negate();
        }
        this.up.Set(0, movementSpeed * delta, 0);
        if ((qPressed && ePressed) || (!qPressed && !ePressed)) {
            this.up.Set(0, 0, 0);
        }
        else if (!qPressed && ePressed) {
            this.up.Negate();
        }
        Vector3.Add(this.forward, this.right, this.movement);
        if (this.movement.Length !== 0) {
            this.movement.Scale(movementSpeed * delta / this.movement.Length);
        }
        this.transform.Position.Add(this.movement).Add(this.up);
    }
}






class Environment extends Entity {
    constructor() {
        super();
        const ignore = new EditorTag();
        const cubeShader = new CubeShader();
        const cubeMeshRender = new MeshRenderer({
            asset: new CubeMesh()
        });
        const floor = new Entity()
            .AddComponents(new Transform({
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [2, 2, 2]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [51 / 255, 12 / 255, 47 / 255]
        }));
        const cube1 = new Entity()
            .AddComponents(ignore, new Transform({
            position: [0, 0.5, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [123 / 255, 40 / 255, 125 / 255]
        }));
        const cube2 = new Entity()
            .AddComponents(ignore, new Transform({
            position: [-2, 1, 0],
            rotation: [0, 45, 0],
            scale: [1, 2, 1]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [112 / 255, 103 / 255, 207 / 255]
        }));
        const cube3 = new Entity()
            .AddComponents(ignore, new Transform({
            position: [2, 1, 0],
            rotation: [0, 30, 0],
            scale: [2, 2, 1]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [183 / 255, 192 / 255, 238 / 255]
        }));
        const cube4 = new Entity()
            .AddComponents(ignore, new Transform({
            position: [0, 0.5, -2],
            rotation: [0, 0, 0],
            scale: [2, 1, 1]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [203 / 255, 243 / 255, 210 / 255]
        }));
        const cube5 = new Entity()
            .AddComponents(ignore, new Transform({
            position: [0, 2.5, -2],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [203 / 255, 243 / 255, 210 / 255].map(x => x * 0.5)
        }));
        const cube6 = new Entity()
            .AddComponents(ignore, new Transform({
            position: [0, 2, -5],
            rotation: [0, 0, 0],
            scale: [5, 5, 1]
        }), cubeMeshRender, new BasicLitMaterial({
            shader: cubeShader,
            alpha: 1.0,
            projectShadows: true,
            receiveShadows: true,
            colour: [203 / 255, 243 / 255, 210 / 255].reverse() //.map(x => x * 0.25) as Colour3Array
        }));
        floor.Name = 'Floor';
        cube1.Name = 'Cube 1';
        cube2.Name = 'Cube 2';
        cube3.Name = 'Cube 3';
        cube4.Name = 'Cube 4';
        cube5.Name = 'Cube 5';
        cube6.Name = 'Cube 6';
        this.AddChild(floor)
            .AddChild(cube1)
            .AddChild(cube2)
            .AddChild(cube3)
            .AddChild(cube6);
        cube3.AddChild(cube4)
            .AddChild(cube5);
        console.log(this);
    }
}



class GeneralAreaLight extends Entity {
    constructor() {
        super();
        this.AddComponents(new AreaLight({
            colour: [1, 1, 1],
            intensity: 0.5
        }));
    }
}





class Grid extends Entity {
    constructor() {
        super();
        this.AddComponents(new Transform({}), new BasicLitMaterial({
            shader: new GridShader(), // assets should be names to index from asset manager
            colour: [1, 1, 1]
        }), new MeshRenderer({
            renderMode: RenderMode.EDGE,
            asset: new GridMesh() // assets should be names to index from asset manager
        }), new Script({}));
    }
    Init() {
        console.log(this);
    }
}



class Sun extends Entity {
    constructor() {
        super();
        this.AddComponents(new Transform({
            rotation: [0, 0, 0]
        }), new DirectionalLight({
            castShadows: true,
            colour: [1, 1, 1],
            intensity: 0.5
        }));
    }
}








export const EditorSceneId = 0;
class EditorScene extends Scene {
    constructor(game) {
        super(game, {
            windows: [DefaultWindow],
            entities: [
            // Grid,
            ],
            sharedEntities: [
                { type: GeneralAreaLight, name: 'GeneralAreaLight' },
                { type: Sun, name: 'Sun' },
                { type: EditorViewer, name: 'EditorViewer' },
                { type: Environment, name: 'Environment' }
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                // EditorRenderSystem,
                ProjectRenderSystem,
            ],
        });
    }
}







class Scene1 extends Scene {
    constructor(game) {
        super(game, {
            windows: [DefaultWindow],
            entities: [],
            sharedEntities: [
                { type: GeneralAreaLight, name: 'GeneralAreaLight' },
                { type: EditorViewer, name: 'EditorViewer' },
                { type: Sun, name: 'Sun' },
                { type: Environment, name: 'Environment' }
            ],
            systems: [
                InputSystem,
                // ProjectRenderSystem,
            ],
        });
    }
}





class EditorRenderSystem extends System {
    cameraView;
    renderableView;
    Init() {
        this.cameraView = Registry.RegisterView([Tag, Camera, Transform], (_, tag) => tag instanceof EditorTag);
        this.renderableView = Registry.RegisterView([Tag, Material, Renderer, Transform], (_, tag) => tag instanceof EditorTag);
    }
    Start() {
        return;
    }
    Stop() {
        return;
    }
    Update() {
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.depthMask(true);
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform);
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera);
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId);
        const cameraMVInverse = cameraMV.Inverse();
        for (const entityId of Registry.GetView(this.renderableView)) {
            if (!Registry.IsEntityActive(entityId)) {
                continue;
            }
            const transform = Registry.GetComponent(entityId, Transform);
            const material = Registry.GetComponent(entityId, BasicLitMaterial);
            const renderer = Registry.GetComponent(entityId, MeshRenderer);
            const mesh = renderer.Asset;
            const shader = material.Shader;
            shader.Bind();
            shader.SetBufferDataField('Camera', 'ViewMatrix', cameraMVInverse, true);
            shader.SetBufferDataField('Camera', 'ProjectionMatrix', cameraCamera.ProjectionMatrix, true);
            shader.PushBufferData('Camera');
            shader.SetBufferDataField('BasicLitMaterial', 'Colour', material.Colour);
            shader.PushBufferData('BasicLitMaterial');
            let renderMode;
            let renderCount;
            let buffer;
            switch (renderer.RenderMode) {
                case RenderMode.FACE:
                    {
                        renderMode = GL.TRIANGLES;
                        renderCount = mesh.FaceCount;
                        buffer = mesh.IsIndexed ? mesh.FaceBuffer : null;
                    }
                    break;
                case RenderMode.EDGE:
                    {
                        renderMode = GL.LINES;
                        renderCount = mesh.EdgeCount;
                        buffer = mesh.IsIndexed ? mesh.EdgeBuffer : null;
                    }
                    break;
                case RenderMode.POINT:
                    {
                        renderMode = GL.POINTS;
                        renderCount = mesh.PointCount;
                        buffer = mesh.IsIndexed ? mesh.PointBuffer : null;
                    }
                    break;
            }
            if (mesh instanceof InstanceMesh) {
                this.drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }
            else {
                this.drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }
            shader.UnBind();
        }
    }
    drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount) {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);
        shader.SetBufferDataField('Object', 'ModelViewMatrix', modelViewMatrix, true);
        shader.SetBufferDataField('Object', 'NormalMatrix', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader.PushBufferData('Object');
        if (buffer) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElementsInstanced(renderMode, renderCount, GL.UNSIGNED_BYTE, 0, mesh.InstanceCount);
        }
        else {
            GL.drawArraysInstanced(renderMode, 0, renderCount, mesh.InstanceCount);
        }
        GL.bindVertexArray(null);
    }
    drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount) {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);
        shader.SetBufferDataField('Object', 'ModelViewMatrix', modelViewMatrix, true);
        shader.SetBufferDataField('Object', 'NormalMatrix', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader.PushBufferData('Object');
        if (buffer) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElements(renderMode, renderCount, GL.UNSIGNED_BYTE, 0);
        }
        else {
            GL.drawArrays(renderMode, 0, renderCount);
        }
        GL.bindVertexArray(null);
    }
}






class ProjectRenderSystem extends System {
    cameraView;
    renderableView;
    renderableShadowView;
    areaLightView;
    directionalLightView;
    finalPassShader;
    window;
    Init() {
        this.cameraView = Registry.RegisterView([Camera, Transform]);
        this.renderableView = Registry.RegisterView([Material, Renderer, Transform], entity => !entity.HasComponent(EditorTag));
        this.renderableShadowView = Registry.RegisterView([Material, Renderer, Transform], (_, material) => material.ProjectsShadows);
        this.areaLightView = Registry.RegisterView([Light], (_, light) => light instanceof AreaLight);
        this.directionalLightView = Registry.RegisterView([Light], (_, light) => light instanceof DirectionalLight);
        this.finalPassShader = new Shader(finalPassShaderVert, finalPassShaderFrag);
        this.window = new DefaultWindow();
        // new RenderWindow({
        //     renderPipelineMode: RenderPipelineMode.DEFERRED,
        //     camera: Registry.GetComponent(Registry.GetView(this.cameraView)[0], Camera)!,
        //     offset: [0,0],
        //     scale: [1,1],
        //     resolution: [1920,1080],
        //     pipeline: undefined,
        //     mainPass: new RenderPipelineStep({
        //         name: 'MAIN_PASS',
        //         shader: null!,
        //         output: new RenderTarget({
        //             colour: [ColourType.FLOAT_RGB, ColourType.FLOAT_RGB, ColourType.FLOAT_RGB],
        //             depth: DepthType.FLOAT32,
        //             height: 1920,
        //             width: 1080,
        //             clear: [0,0,0,0]
        //         })
        //     })
        // })
    }
    Start() {
        return;
    }
    Stop() {
        return;
    }
    Update() {
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.depthMask(true);
        GL.cullFace(GL.FRONT);
        for (var entityId of Registry.GetView(this.directionalLightView)) {
            this.renderShadows(entityId, Registry.GetComponent(entityId, DirectionalLight));
        }
        GL.cullFace(GL.BACK);
        this.renderScene(this.window);
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.finalPassShader.Bind();
        this.finalPassShader.SetTexture('U_Position', this.window.FinalComposite.ColourAttachments[0]);
        this.finalPassShader.SetTexture('U_Normal', this.window.FinalComposite.ColourAttachments[1]);
        this.finalPassShader.SetTexture('U_Albedo_Alpha', this.window.FinalComposite.ColourAttachments[2]);
        this.finalPassShader.SetTexture('U_Depth', this.window.FinalComposite.DepthAttachment);
        this.finalPassShader.SetTexture(`U_Dir_Tex`, Registry.GetComponent(Registry.GetView(this.directionalLightView)[0], DirectionalLight).RenderTarget.DepthAttachment);
        let a = 0;
        for (var entityId of Registry.GetView(this.areaLightView)) {
            const light = Registry.GetComponent(entityId, AreaLight);
            this.finalPassShader.SetFloatVector(`U_AreaLight[${a}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(`U_AreaLight[${a}].Intensity`, light.Intensity);
            a++;
        }
        let d = 0;
        for (var entityId of Registry.GetView(this.directionalLightView)) {
            const light = Registry.GetComponent(entityId, DirectionalLight);
            const transform = Registry.GetComponent(entityId, Transform);
            const rotation = transform.GlobalRotation(entityId);
            const rotationMatrix = Matrix4.RotationMatrix(rotation.X / 2, rotation.Y, rotation.Z);
            const direction = Matrix4.MultiplyVector(rotationMatrix, [...DirectionalLight.DefaultDirection, 1.0]);
            this.finalPassShader.SetFloatVector(`U_DirectionalLight[${d}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].Intensity`, light.Intensity);
            this.finalPassShader.SetFloatVector(`U_DirectionalLight[${d}].Direction`, direction.XYZ.Negate());
            this.finalPassShader.SetBool(`U_DirectionalLight[${d}].CastShadows`, light.CastShadows);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].TexelSize`, 1 / light.RenderTarget.Width);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].TexelCount`, ((light.PCFLevel * 2) + 1) ** 2);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].Bias`, light.Bias);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].PCFLevel`, light.PCFLevel);
            this.finalPassShader.SetMatrix(`U_DirectionalLight[${d}].ProjectionMatrix`, light.ProjectionMatrix, true);
            this.finalPassShader.SetMatrix(`U_DirectionalLight[${d}].ViewMatrix`, rotationMatrix, true);
            d++;
        }
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform);
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera);
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId).Inverse();
        this.finalPassShader.SetBufferDataField('Camera', 'View', cameraMV, true);
        this.finalPassShader.SetBufferDataField('Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
        this.finalPassShader.PushBufferData('Camera');
        GL.bindVertexArray(this.window.Panel.VertexArrayBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.window.Panel.FaceBuffer);
        GL.drawElements(GL.TRIANGLES, this.window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
        GL.bindVertexArray(null);
        this.finalPassShader.UnBind();
    }
    renderShadows(parentId, light) {
        light.BindForShadows(parentId);
        for (const entityId of Registry.GetView(this.renderableView)) {
            if (!Registry.IsEntityActive(entityId)) {
                continue;
            }
            const tag = Registry.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag) {
                continue;
            }
            const material = Registry.GetComponent(entityId, BasicLitMaterial);
            if (!material.ProjectsShadows) {
                continue;
            }
            const transform = Registry.GetComponent(entityId, Transform);
            const renderer = Registry.GetComponent(entityId, MeshRenderer);
            const mesh = renderer.Asset;
            let renderMode;
            let renderCount;
            let buffer;
            switch (renderer.RenderMode) {
                case RenderMode.FACE:
                    {
                        renderMode = GL.TRIANGLES;
                        renderCount = mesh.FaceCount;
                        buffer = mesh.IsIndexed ? mesh.FaceBuffer : null;
                    }
                    break;
                case RenderMode.EDGE:
                    {
                        renderMode = GL.LINES;
                        renderCount = mesh.EdgeCount;
                        buffer = mesh.IsIndexed ? mesh.EdgeBuffer : null;
                    }
                    break;
                case RenderMode.POINT:
                    {
                        renderMode = GL.POINTS;
                        renderCount = mesh.PointCount;
                        buffer = mesh.IsIndexed ? mesh.PointBuffer : null;
                    }
                    break;
            }
            DirectionalLight.ShadowShader.SetMatrix('U_Transform.ModelView', transform.GlobalModelViewMatrix(entityId), true);
            if (mesh instanceof InstanceMesh) {
                this.drawInstanceMesh(entityId, mesh, transform, null, buffer, renderMode, renderCount);
            }
            else {
                this.drawMesh(entityId, mesh, transform, null, buffer, renderMode, renderCount);
            }
        }
        light.UnbindForShadows();
    }
    renderScene(window) {
        window.MainPass.Output.Bind();
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform);
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera);
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId).Inverse();
        for (const entityId of Registry.GetView(this.renderableView)) {
            if (!Registry.IsEntityActive(entityId)) {
                continue;
            }
            const tag = Registry.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag) {
                continue;
            }
            const transform = Registry.GetComponent(entityId, Transform);
            const material = Registry.GetComponent(entityId, BasicLitMaterial);
            const renderer = Registry.GetComponent(entityId, MeshRenderer);
            const mesh = renderer.Asset;
            const shader = material.Shader;
            shader.Bind();
            shader.SetBufferDataField('Camera', 'View', cameraMV, true);
            shader.SetBufferDataField('Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
            shader.PushBufferData('Camera');
            material.BindBlock(shader);
            let renderMode;
            let renderCount;
            let buffer;
            switch (renderer.RenderMode) {
                case RenderMode.FACE:
                    {
                        renderMode = GL.TRIANGLES;
                        renderCount = mesh.FaceCount;
                        buffer = mesh.IsIndexed ? mesh.FaceBuffer : null;
                    }
                    break;
                case RenderMode.EDGE:
                    {
                        renderMode = GL.LINES;
                        renderCount = mesh.EdgeCount;
                        buffer = mesh.IsIndexed ? mesh.EdgeBuffer : null;
                    }
                    break;
                case RenderMode.POINT:
                    {
                        renderMode = GL.POINTS;
                        renderCount = mesh.PointCount;
                        buffer = mesh.IsIndexed ? mesh.PointBuffer : null;
                    }
                    break;
            }
            if (mesh instanceof InstanceMesh) {
                this.drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }
            else {
                this.drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }
            shader.UnBind();
        }
    }
    drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount) {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);
        shader?.SetBufferDataField('Transform', 'Model', modelViewMatrix, true);
        shader?.SetBufferDataField('Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData('Transform');
        if (buffer) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElementsInstanced(renderMode, renderCount, GL.UNSIGNED_BYTE, 0, mesh.InstanceCount);
        }
        else {
            GL.drawArraysInstanced(renderMode, 0, renderCount, mesh.InstanceCount);
        }
        GL.bindVertexArray(null);
    }
    drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount) {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);
        shader?.SetBufferDataField('Transform', 'Model', modelViewMatrix, true);
        shader?.SetBufferDataField('Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData('Transform');
        if (buffer) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElements(renderMode, renderCount, GL.UNSIGNED_BYTE, 0);
        }
        else {
            GL.drawArrays(renderMode, 0, renderCount);
        }
        GL.bindVertexArray(null);
    }
}
