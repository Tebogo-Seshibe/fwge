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

struct Materials
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
uniform Materials U_Material;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D ShadowMap;
    sampler2D DirectionalShadow;
};
uniform Sampler U_Sampler;

uniform sampler2D U_DirectionalSampler;

// struct AmbientLightStruct
// {
//     bool HasEnvironmentMap;
//     sampler3D EnvironmentMap;
// };
// uniform AmbientLightStruct U_AmbientLight;

uniform BasicLitMaterial
{
    vec4 Albedo;
} material;

uniform AreaLight
{
    vec3 Colour;
    float Intensity;
} areaLight;

uniform DirectionalLight
{
    vec3 Colour;
    float Intensity;
    
    vec3 Direction;
    bool CastShadows;
    
    vec4 Data;
    // float TexelSize;
    // float TexelCount;
    // float Bias;
    // int PCFLevel;

    mat4 ShadowMatrix;
} directionalLight;

uniform PointLight
{
    vec3 Colour;
    float Intensity;
    
    vec3 Position;
    float Radius;
} pointLight;


float ShadowWeightPoint(float diffuseDot)
{
    return 1.0;
}

float ShadowWeightDirectional(float diffuseDot)
{
    if (!U_Material.ReceiveShadows)
    {
        return 0.0;
    }
    
    float texelSize = directionalLight.Data[0];
    float texelCount = directionalLight.Data[1];
    float bias = directionalLight.Data[2];
    float pcfLevel = directionalLight.Data[3];

    float total = 0.0;
    vec3 lightPosition = (V_LightPosition.xyz / V_LightPosition.w) * 0.5 + 0.5;
    vec2 fragUV = lightPosition.xy;
    float fragmentDepth = lightPosition.z;
    
    for (float x = -pcfLevel; x <= pcfLevel; ++x)
    {
        for (float y = -pcfLevel; y <= pcfLevel; ++y)
        {
            vec2 offset = vec2(x, y) * texelSize;
            float shadowDepth = texture(U_Sampler.DirectionalShadow, fragUV + offset).r + bias;
            if (shadowDepth < fragmentDepth)
            {
                total += 1.0;
            }
        }
    }

    return total / texelCount;
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

vec3 CalcDirectionalLight(vec3 colour, float intensity, vec3 direction, vec3 normal)
{
    float val = dot(normal, -direction);
    float diffuse = max(val, 0.0);
    float shadow = 1.0 - ShadowWeightDirectional(val);

    return colour * diffuse * intensity * shadow;
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

void main(void)
{
    vec3 normal = normalize(V_Normal); // * texture(U_Sampler.Bump, V_UV).xyz);

    vec3 area = CalcAreaLight(areaLight.Colour, areaLight.Intensity, normal);
    vec3 directional = CalcDirectionalLight(directionalLight.Colour, directionalLight.Intensity, directionalLight.Direction, normal);
    vec3 point = CalcPointLight(pointLight.Colour, pointLight.Intensity, pointLight.Position, pointLight.Radius, normal, U_Material.Shininess);

    vec3 lighting = area + directional + point;

    vec4 tex = texture(U_Sampler.Image, V_UV);
    vec3 albedo = U_Material.Colour * tex.rgb;
    float alpha = U_Material.Alpha * tex.a;

    O_FragColour = vec4(lighting * albedo, alpha);
}
