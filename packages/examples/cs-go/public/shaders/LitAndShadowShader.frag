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
