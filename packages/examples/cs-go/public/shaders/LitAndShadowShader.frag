#version 300 es

layout (std140) uniform;
precision highp float;
precision highp sampler2D;

in vec3 V_Position;
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
} directionalLight;

uniform sampler2D U_DirectionalSampler;

uniform PointLight
{
    vec3 Colour;
    float Intensity;
    
    vec3 Position;
    float Radius;
} pointLight;

uniform AreaLight
{
    vec3 Colour;
    float Intensity;
} areaLight;

// uniform MyMaterial
// {
//     vec3 Ambient;
//     float Alpha;

//     vec3 Diffuse;
//     float Shininess;

//     vec3 Specular;
// } myMaterial;

float ShadowWeightPoint(float diffuseDot)
{
    return 1.0;
}

float ShadowWeightDirectional(float diffuseDot)
{
    if (!U_Material.ReceiveShadows)
    {
        return 1.0;
    }
    
    float texelSize = directionalLight.Data[0];
    float texelCount = directionalLight.Data[1];
    float bias = directionalLight.Data[2];
    int pcfLevel = int(directionalLight.Data[3]);

    float total = 0.0;
    vec3 lightPosition = V_LightPosition.xyz * 0.5 + 0.5;
    vec2 fragUV = lightPosition.xy;
    float fragmentDepth = lightPosition.z - bias;

    for (int x = -pcfLevel; x <= pcfLevel; ++x)
    {
        for (int y = -pcfLevel; y <= pcfLevel; ++y)
        {
            float shadowDepth = texture(U_Sampler.DirectionalShadow, fragUV + (vec2(x, y) * texelSize)).r;
            if (shadowDepth < fragmentDepth)
            {
                total += 1.0;
            }   
        }
    }
    return 1.0 - (total / texelCount);
}


vec3 CalcAreaLight(vec3 colour, float intensity)
{
    return colour * intensity;
}

vec3 CalcDirectionalLight(vec3 colour, float intensity, vec3 direction, vec3 normal)
{
    float val = dot(normal, -direction);
    float diffuse = max(val, 0.0);
    float shadow = ShadowWeightDirectional(val);

    return colour * diffuse * intensity * shadow;
}

vec3 CalcPointLight(vec3 colour, float intensity, vec3 position, float radius, vec3 normal)
{
    vec3 diff = position - V_Position;
    vec3 dir = normalize(diff);
    float dist = length(diff);

    float val = dot(normal, dir);
    float diffuse = max(0.0, val);
    float attenuation = radius / (dist * dist);

    float shadow = ShadowWeightPoint(val);

    return colour * diffuse * attenuation * intensity;
}

void main(void)
{
    vec3 normal = normalize(V_Normal * texture(U_Sampler.Bump, V_UV).xyz);

    vec3 area = CalcAreaLight(areaLight.Colour, areaLight.Intensity);
    vec3 directional = CalcDirectionalLight(directionalLight.Colour, directionalLight.Intensity, directionalLight.Direction, normal);
    vec3 point = CalcPointLight(pointLight.Colour, pointLight.Intensity, pointLight.Position, pointLight.Radius, normal);

    vec3 lighting = area + directional + point;

    vec4 tex = texture(U_Sampler.Image, V_UV);
    vec3 albedo = U_Material.Colour * tex.rgb;
    float alpha = U_Material.Alpha * tex.a;

    O_FragColour = vec4(lighting * albedo, alpha);
}
