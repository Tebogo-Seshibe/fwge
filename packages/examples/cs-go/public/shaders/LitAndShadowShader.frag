#version 300 es

precision highp float;
precision highp sampler2D;

in vec3 V_Position;
in vec3 V_Normal;
in vec2 V_UV;
in vec3 V_Colour;
in vec3 V_LightPosition;

layout(location = 0) out vec4 O_FragColour;

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
};
uniform Material U_Material;

struct PointLight
{
    vec3 Colour;
    float Intensity;  

    vec3 Position;
    float Radius;
};
uniform PointLight U_PointLight[4];

struct DirectionalLight
{
    vec3 Colour;
    float Intensity;  

    vec3 Direction;
};
uniform DirectionalLight U_DirectionalLight;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D ShadowMap;
};
uniform Sampler U_Sampler;


float ShadowWeight(float diffuseDot)
{
    float offset = 0.01;
    float bias = max(offset * (1.0 - diffuseDot), offset);
    vec3 lightPosition = V_LightPosition.xyz * 0.5 + 0.5;
    if (lightPosition.z > 1.0)
    {
        lightPosition.z = 1.0;
    }

    float shadow = 0.0;
    vec2 texelSize = vec2(1 / textureSize(U_Sampler.ShadowMap, 0));
    for (int x = -1; x <= 1; ++x)
    {
        for (int y = -1; y <= 1; ++y)
        {
            vec2 offset = vec2(x, y) * texelSize;
            float shadowDepth = texture(U_Sampler.ShadowMap, lightPosition.xy + offset).r;
            shadow += (shadowDepth + bias) < lightPosition.z ? 0.0 : 1.0;
        }
    }
    return shadow / 9.0;
}


float DiffuseWeight(vec3 normal, vec3 lightDirection)
{
    float diffuseDot = dot(normal, lightDirection);
    float diffuseWeight = max(diffuseDot, 0.0);
    float shadowWeight = ShadowWeight(diffuseDot);

    return diffuseWeight * shadowWeight;
}

vec3 acesToneMapping(vec3 colour)
{
    const float slope = 12.0;
    const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;

    vec4 x = vec4(colour, (colour.r * 0.299) + (colour * 0.587) + (colour * 0.0114));
    vec4 tonemap = clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    float t = x.a;
    t = t * t / (slope + t);

    return mix(tonemap.rgb, tonemap.aaa, t);
}

vec3 Gamma(vec3 colour)
{
    float gamma = 1.0/2.2;
    colour.x = pow(colour.x, gamma);
    colour.y = pow(colour.y, gamma);
    colour.z = pow(colour.z, gamma);
    return colour;
}

void main(void)
{
    vec3 normal = normalize(V_Normal * texture(U_Sampler.Bump, V_UV).xyz);

    float directionalShadow = DiffuseWeight(normal, U_DirectionalLight.Direction);
    vec3 directionalDiffuse =(U_DirectionalLight.Colour * U_DirectionalLight.Intensity);
    
    vec4 tex = texture(U_Sampler.Image, V_UV);
    vec3 ambient = tex.rgb * U_Material.Colour;
    vec3 diffuse = directionalShadow * directionalDiffuse;
    vec3 specular = vec3(0.0);
    float alpha = U_Material.Alpha * tex.a;
    

    // vec3 pointDiffuse = Diffuse(U_PointLight.Position) * U_DirectionalLight.Diffuse;


    O_FragColour = vec4(ambient + diffuse + specular, alpha);
    // O_FragColour = vec4(normal, 1.0);
}
