export const cubeShaderVert =
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
} camera;

void main(void)
{
    V_Vertex.Position = (transform.Model * vec4(A_Position, 1.0)).xyz;    
    V_Vertex.Normal = normalize(transform.Normal * A_Normal);
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour.rgb;
    
    gl_Position = camera.Projection * camera.View * vec4(V_Vertex.Position, 1.0);
}
`;

export const cubeShaderFrag =
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
}
`;

export const finalPassShaderVert =
`#version 300 es
#pragma vscode_glsllint_stage: vert

layout(location = 0) in vec2 A_Position;
out vec2 V_UV;

void main(void)
{
    V_UV = A_Position * 0.5 + 0.5;
    gl_Position = vec4(A_Position, 0.0, 1.0);
}
`

export const finalPassShaderFrag =
`#version 300 es
#pragma vscode_glsllint_stage: frag

precision highp float;
layout (std140) uniform;

in vec2 V_UV;
layout(location = 0) out vec4 O_FragColour;

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

float ShadowWeightDirectional(DirectionalLight dir, float diffuseDot, sampler2D shadowSampler, mat4 shadowMatrix)
{
    vec4 shadowPosition = shadowMatrix * vec4(fragment.Position, 1.0);
    float bias = max(dir.Bias * (1.0 - diffuseDot), 0.0005);
    vec3 lightPosition = (shadowPosition.xyz / shadowPosition.w) * 0.5 + 0.5;
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

    return total / dir.TexelCount;
}

vec3 CalcDirectionalLight(DirectionalLight light)
{
    mat4 shadowMatrix = light.ProjectionMatrix * light.ViewMatrix;
    float val = dot(fragment.Normal, light.Direction);
    float diffuse = max(val, 0.0);
    float cascade = ShadowWeightDirectional(light, val, U_Dir_Tex, shadowMatrix); //U_OtherMatrix[0]);
    float shadow = 1.0 - cascade;

    return light.Colour * diffuse * light.Intensity * shadow;
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
    
    O_FragColour = vec4(fragment.Diffuse + light, fragment.Alpha);
    O_FragColour = vec4(texture(U_Dir_Tex, V_UV).r);
    // O_FragColour = vec4(area, 1.0);
    // O_FragColour = vec4(dir, 1.0);
    // O_FragColour = vec4(light, 1.0);
    // O_FragColour = vec4(vec3(float(U_DirectionalLight.length() / 16)), 1.0);
    // O_FragColour = vec4(U_AreaLight[0].Colour, 1.0);
    // O_FragColour = vec4(vec3(U_DirectionalLight[0].CastShadows), 1.0);
}
`