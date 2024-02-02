import { BasicLitMaterial, type IMesh, MeshRenderer, RenderMode, RenderType, Shader, StaticMesh, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class Tetromino extends Entity
{
    override Init(): void
    {
        this.AddComponent(new Transform());
        this.AddComponent(new BasicLitMaterial(
            {
                shader:     new Shader(shaderVert, shaderFrag),
                alpha:      1.0,
                ambient:    [0.75,0.75,0.75],
                diffuse:    [0.90,0.90,0.90],
                specular:   [1.00,1.00,1.00],
                colour:     [1.00,1.00,1.00],
                renderType: RenderType.OPAQUE,
            }));
            this.AddComponent(new MeshRenderer(
            {
                asset: new StaticMesh(asset),
                renderMode: RenderMode.FACE
            }));
    }
}


const shaderVert = 
`#version 300 es

layout (std140) uniform;
precision highp float;

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
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
    V_Vertex.Normal = normalize(object.NormalMatrix * A_Normal);
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour;

    gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * vec4(V_Vertex.Position, 1.0);
}
`;

const shaderFrag = `#version 300 es

precision highp float;
precision highp sampler2D;

// layout (std140) uniform;
// layout(location = 0) out vec3 O_Position;
// layout(location = 1) out vec3 O_Normal;
// layout(location = 2) out vec4 O_DiffuseSpecular;

layout(location = 0) out vec4 O_FragColour;

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
in Vertex V_Vertex;

// struct Sampler
// {
//     sampler2D Image;
//     sampler2D Bump;
// };
// uniform Sampler U_Sampler;

// uniform BasicLitMaterial
// {
//     vec3 Colour;
//     float Shininess;
//     float Alpha;

//     vec3 Ambient;
//     vec3 Diffuse;
//     vec3 Specular;

//     bool HasImageMap;
//     bool HasBumpMap;
//     bool ReceiveShadows;
// } basicLitMaterial;

// uniform DirectionalLights
// {
//     vec3 Colour;
// };

void main(void)
{
    // vec4 tex = texture(U_Sampler.Image, V_Vertex.UV);
    // vec3 albedo = basicLitMaterial.Colour * tex.rgb * V_Vertex.Colour;
    // float alpha = basicLitMaterial.Alpha * tex.a;

    // O_Position = V_Vertex.Position;
    // O_Normal = normalize(V_Vertex.Normal * texture(U_Sampler.Bump, V_Vertex.UV).xyz);
    // O_DiffuseSpecular = vec4(albedo, alpha);

    O_FragColour = vec4(1.0);
}
`;

const asset: IMesh =
{
    position:
    [
        [-0.5,  0.5,  0.5],
        [-0.5, -0.5,  0.5],
        [ 0.5, -0.5,  0.5],
        [ 0.5,  0.5,  0.5],

        [ 0.5,  0.5,  0.5],
        [ 0.5, -0.5,  0.5],
        [ 0.5, -0.5, -0.5],
        [ 0.5,  0.5, -0.5],

        [ 0.5,  0.5, -0.5],
        [ 0.5, -0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [-0.5,  0.5, -0.5],

        [-0.5,  0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [-0.5, -0.5,  0.5],
        [-0.5,  0.5,  0.5],

        [-0.5,  0.5, -0.5],
        [-0.5,  0.5,  0.5],
        [ 0.5,  0.5,  0.5],
        [ 0.5,  0.5, -0.5],

        [-0.5, -0.5,  0.5],
        [-0.5, -0.5, -0.5],
        [ 0.5, -0.5, -0.5],
        [ 0.5, -0.5,  0.5],
    ],
    normal:
    [
        [ 0.0,  0.0, 1.0],
        [ 0.0,  0.0, 1.0],
        [ 0.0,  0.0, 1.0],
        [ 0.0,  0.0, 1.0],

        [ 1.0,  0.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0,  0.0,  0.0],

        [ 0.0,  0.0,  -1.0],
        [ 0.0,  0.0,  -1.0],
        [ 0.0,  0.0,  -1.0],
        [ 0.0,  0.0,  -1.0],

        [-1.0,  0.0,  0.0],
        [-1.0,  0.0,  0.0],
        [-1.0,  0.0,  0.0],
        [-1.0,  0.0,  0.0],

        [ 0.0,  1.0,  0.0],
        [ 0.0,  1.0,  0.0],
        [ 0.0,  1.0,  0.0],
        [ 0.0,  1.0,  0.0],

        [ 0.0, -1.0,  0.0],
        [ 0.0, -1.0,  0.0],
        [ 0.0, -1.0,  0.0],
        [ 0.0, -1.0,  0.0],
    ],
    colour:
    [
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
    uv:
    [                
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
    index:
    [
         0,  1,  2,  0,  2,  3,
         4,  5,  6,  4,  6,  7,
         8,  9, 10,  8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ]
};
