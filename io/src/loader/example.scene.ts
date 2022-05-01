export default `{
    "startUpScene": 0,
    "scenes": [
        {
            "systems": [
                0,
                1,
                2,
                3,
                4,
                5
            ],
            "entities": [
                0,
                1
            ]
        }
    ],
    "systems": [
        {
            "type": "InputSystem"
        },
        {
            "type": "ScriptSystem"
        },
        {
            "type": "PhysicsSystem"
        },
        {
            "type": "MeshRenderSystem",
            "config": {
                "renderGrid": true,
                "min": -100,
                "max": 100,
                "step": 1,
                "wireframe": false
            }
        },
        {
            "type": "ParticleSystem"
        },
        {
            "type": "ColliderOutlineSystem"
        }
    ],
    "entities": [
        {
            "type": "Entity",
            "components": [
                0
            ]
        },
        {
            "type": "FPSController",
            "config": {
                
            }
        }
    ],
    "components": [
        {
            "type": "Transform",
            "config": {
                "position": [
                    0,
                    0,
                    0
                ],
                "rotation": [
                    0,
                    0,
                    0
                ],
                "scale": [
                    1,
                    1,
                    1
                ],
                "shear": [
                    0,
                    0,
                    0
                ]
            }
        },
        {
            "type": "Transform",
            "config": {
                "position": [
                    0,
                    1.8,
                    0
                ],
                "rotation": [
                    0,
                    0,
                    0
                ],
                "scale": [
                    1,
                    1,
                    1
                ],
                "shear": [
                    0,
                    0,
                    0
                ]
            }
        },        
        {
            "type": "Material",
            "config": {
                "alpha": 1,
                "shininess": 32,
                "ambient": [0.25, 0.25, 0.25, 1],
                "diffuse": [0.75, 0.75, 0.75, 1],
                "specular": [1, 1, 1, 1],
                "imagemap": "/objects/cube/textures/CubeUV.png"
            }
        },    
        {
            "type": "Material",
            "config": {
                "alpha": 1,
                "shininess": 32,
                "ambient": [0.25, 0.25, 0.25, 1],
                "diffuse": [0.75, 0.75, 0.75, 1],
                "specular": [1, 1, 1, 1]
            }
        },    
        {
            "type": "Material",
            "config": {
                "alpha": 0.1,
                "shininess": 32,
                "ambient": [1.0, 1.0, 1.0, 1.0],
                "diffuse": [1.0, 1.0, 1.0, 1.0],
                "specular": [1.0, 1.0, 1.0, 1.0]
            }
        },
        {
            "type": "ShaderAsset",
            "config": {
                "vertexShader": {
                    "source": "#version 300 es\\n\\nlayout(location = 0) in vec4 A_Position;\\nlayout(location = 1) in vec3 A_Normal;\\nlayout(location = 2) in vec2 A_UV;\\nlayout(location = 3) in vec4 A_Colour;\\nlayout(location = 4) in mat4 A_ModelViewMatrix;\\nlayout(location = 8) in mat3 A_NormalMatrix;\\n\\nout vec4 V_Position;\\nout vec3 V_Normal;\\nout vec2 V_UV;\\nout vec4 V_Colour;\\n\\nstruct Matrix\\n{\\nmat4 ModelView;\\nmat4 View;\\nmat4 Projection;\\n};\\nuniform Matrix U_Matrix;\\n\\nvoid passVertexData()\\n{\\nV_Position = U_Matrix.ModelView * A_Position;\\nV_Normal = A_Normal;\\nV_UV = A_UV;\\nV_Colour = A_Colour;\\n}\\n\\nvoid main(void)\\n{\\npassVertexData();\\n\\ngl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;\\n}",
                    "input": []
                },
                "fragmentShader": {
                    "source": "#version 300 es\\nprecision mediump float;\\n\\nin vec4 V_Position;\\nin vec3 V_Normal;\\nin vec2 V_UV;\\nin vec4 V_Colour;\\n// in vec4 V_Shadow;\\nout vec4 OutColour;\\n\\nstruct Sampler\\n{\\nsampler2D Image;\\nsampler2D Bump;\\nsampler2D Shadow;\\n};\\n\\nstruct AmbientLight\\n{\\nvec4 Colour;\\nfloat Intensity;\\n};\\n\\nstruct DirectionalLight\\n{\\nvec4 Colour;\\nfloat Intensity;\\n\\nvec3 Diriection;\\n};\\n\\nstruct PointLight\\n{\\nvec4 Colour;\\nfloat Intensity;\\n\\nvec3 Position;\\nfloat Radius;\\nfloat Angle;\\n};\\n\\nstruct Material\\n{\\nvec4 Ambient;\\nvec4 Diffuse;\\nvec4 Specular;\\nfloat Shininess;\\nfloat Alpha;\\n\\nbool HasImageMap;\\nbool HasBumpMap;\\n};\\n\\nuniform AmbientLight U_AmbientLight;\\nuniform DirectionalLight U_DirectionalLight;\\nuniform PointLight U_PointLight[4];\\n\\nuniform Sampler U_Sampler;\\nuniform Material U_Material;\\n\\nvec4 AmbientLightColour()\\n{\\nreturn U_AmbientLight.Colour * U_AmbientLight.Intensity;\\n}\\n\\n// vec4 HemisphereLightColour = vec4(0.0);\\n// vec4 RectLightColour = vec4(0.0);\\n\\n// vec4 DirectionalLightColour = vec4(0.0);\\n// vec4 SpotLightColour = vec4(0.0);\\n\\nvec4 CalcPointLight(in PointLight point)\\n{\\nfloat falloff = smoothstep(point.Radius, 0.0, min(length(point.Position - V_Position.xyz), point.Radius));\\nvec3 L = normalize(point.Position - V_Position.xyz);\\nvec3 E = -V_Position.xyz;\\nvec3 N = V_Normal;\\n\\nvec3 H = normalize(L + E);\\nvec4 ambient = U_Material.Ambient;\\n\\nfloat Kd = max(dot(L, H), 0.0);\\nvec4 diffuse = Kd * U_Material.Diffuse;\\n\\nfloat Ks = pow(max(dot(N, H), 0.0), U_Material.Shininess);\\nvec4 specular = Ks * U_Material.Specular;\\n\\nif (dot(L, H) < 0.0)\\n{\\nspecular = vec4(vec3(0.0), 1.0);\\n}\\n\\nreturn vec4(\\n(\\n(ambient + diffuse + specular)\\n* point.Colour\\n* point.Intensity\\n* falloff\\n).rgb,\\n1.0);\\n}\\n\\n// vec4 PointLightColour()\\n// {\\n//     return \\n//         CalcPointLight(U_PointLight[0]) +\\n//         CalcPointLight(U_PointLight[1]) +\\n//         CalcPointLight(U_PointLight[2]) +\\n//         CalcPointLight(U_PointLight[3]);\\n// }\\n\\nvec4 MyCalcPointLight(in PointLight point)\\n{\\nfloat falloff = smoothstep(point.Radius, 0.0, min(length(point.Position - V_Position.xyz), point.Radius));\\nreturn vec4(vec3(falloff), 1.0);\\n}\\n\\nvec4 Light()\\n{\\nvec4 light = vec4(0.0);\\n\\nlight += MyCalcPointLight(U_PointLight[0]);\\nlight += MyCalcPointLight(U_PointLight[1]);\\nlight += MyCalcPointLight(U_PointLight[2]);\\nlight += MyCalcPointLight(U_PointLight[3]);\\n\\nreturn light;\\n}\\n\\nvec4 Colour()\\n{\\nif (U_Material.HasImageMap)\\n{\\nreturn texture(U_Sampler.Image, V_UV);\\n}\\nelse\\n{\\nreturn V_Colour;\\n}\\n}\\n\\nvoid main()\\n{ \\nvec4 col = Colour();\\nfloat alpha = U_Material.Alpha * col.a;\\n\\nOutColour = vec4(col.rgb * Light().rgb, alpha);\\n}",
                    "input": []
                }
            }
        },
        {
            "type": "Camera",
            "config": { 
                "fieldOfView": 50
            }
        }
    ]
}`