#version 300 es

layout (std140) uniform;
precision highp float;
precision highp sampler2D;
precision highp sampler3D;

in vec3 V_Position;
in vec3 V_Position_2;
in vec3 V_Normal;
in vec2 V_UV;
in vec3 V_Colour;
in vec4 V_LightPosition;

layout (location = 0) out vec4 O_FragColour;

struct Material
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
};
uniform Material U_Material;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D ShadowMap;
    sampler2D DirectionalShadow;
};
uniform Sampler U_Sampler;
uniform sampler2D U_DirectionalSampler;

struct AreaLight
{
    vec3 Colour;
    float Intensity;
};
uniform AreaLight U_AreaLight;

// uniform DirectionalLightBuffer { vec4 _DL_Data0; vec4 _DL_Data1; vec4 _DL_Data2; mat4 _DL_Data3; };

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

    mat4 ShadowMatrix;
};
uniform DirectionalLight U_DirectionalLight;

struct PointLight
{
    vec3 Colour;
    float Intensity;

    vec3 Position;
    float Radius;
};
uniform PointLight U_PointLight;


float ShadowWeightPoint(float diffuseDot)
{
    return 1.0;
}

float ShadowWeightDirectional(float diffuseDot)
{
    DirectionalLight dir = U_DirectionalLight;

    if (!U_Material.ReceiveShadows)
    {
        return 0.0;
    }

    float bias = 0.0; // dir.Bias; //max( * (1.0 - diffuseDot), 0.005);
    // float bias = max(0.05 * (1.0 - diffuseDot), 0.005);
    // float bias = dir.Bias * (1.0 - diffuseDot);
    // float bias = 0.005 * (1.0 - diffuseDot);
    vec3 lightPosition = (V_LightPosition.xyz / V_LightPosition.w) * 0.5 + 0.5;
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
            float shadowDepth = texture(U_Sampler.DirectionalShadow, uv).r + bias;

            if (shadowDepth < fragmentDepth)
            {
                total += 1.0;
            }
        }
    }

    return total / dir.TexelCount;
}

uniform sampler3D AmbientEnvironmentMap;
uniform bool HasAmbientEnvironmentMap;
vec3 CalcAreaLight(vec3 colour, float intensity, vec3 fragNormal)
{
    vec3 environment = HasAmbientEnvironmentMap
        ? texture(AmbientEnvironmentMap, vec3(0,-1,0)).rgb
        : vec3(0.0);

    return (environment + colour) * intensity;
}

vec3 CalcDirectionalLight(vec3 normal)
{
    DirectionalLight dir = U_DirectionalLight;

    float val = dot(normal, -dir.Direction);
    float diffuse = max(val, 0.0);
    float shadow = 1.0 - ShadowWeightDirectional(val);

    return dir.Colour * diffuse * dir.Intensity * shadow;
}

vec3 CalcPointLight(vec3 colour, float intensity, vec3 lightPosition, float radius, vec3 fragNormal, float shininess)
{
    vec3 difference = lightPosition - V_Position;
    vec3 direction = normalize(difference);
    vec3 eye = normalize(-fragNormal);
    vec3 reflection = reflect(direction, fragNormal);
    float len = length(difference);

    float diffuseWeight = max(0.0, dot(fragNormal, direction));
    float specularWeight = pow(max(0.0, dot(reflection, eye)), shininess);

    float attenuation = radius / (len * len);

    vec3 diffuse = colour * diffuseWeight * attenuation;
    vec3 specular = colour * specularWeight * attenuation;

    return (diffuse + specular) * intensity;
}

// void DestructureDirectionalLight()
// {
//     dir.Colour = _DL_Data0.xyz;
//     dir.Intensity = _DL_Data0.w;
//     dir.Direction = _DL_Data1.xyz;
//     dir.CastShadows = bool(_DL_Data1.w);
//     dir.TexelSize = _DL_Data2.x;
//     dir.TexelCount = _DL_Data2.y;
//     dir.Bias = _DL_Data2.z;
//     dir.PCFLevel = _DL_Data2.w;
//     dir.ShadowMatrix = _DL_Data3;
// }

void main(void)
{
    
    AreaLight areaLight = U_AreaLight;
    PointLight pointLight = U_PointLight;

    // DestructureDirectionalLight();
    vec3 normal = normalize(V_Normal); // * texture(U_Sampler.Bump, V_UV).xyz);

    vec3 area = CalcAreaLight(areaLight.Colour, areaLight.Intensity, normal);
    vec3 directional = CalcDirectionalLight(normal);
    vec3 point = CalcPointLight(pointLight.Colour, pointLight.Intensity, pointLight.Position, pointLight.Radius, normal, U_Material.Shininess);

    vec3 lighting = area + directional + point;

    vec4 tex = texture(U_Sampler.Image, V_UV);
    vec3 albedo = U_Material.Colour * tex.rgb;
    float alpha = U_Material.Alpha * tex.a;

    O_FragColour = vec4(lighting * albedo, alpha);
}
