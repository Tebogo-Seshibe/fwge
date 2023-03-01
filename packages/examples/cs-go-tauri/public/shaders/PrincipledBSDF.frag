#version 300 es

precision highp float;
precision highp sampler2D;
precision highp sampler3D;

struct AreaLight
{
    vec3 Colour;
    float Intensity;
    bool HasColourMap;
};

struct DirectionalLight
{
    vec3 Colour;
    float Intensity;
    vec3 Direction;
};

struct PointLight
{
    vec3 Colour;
    float Intensity;
    vec3 Position;
    float Radius;
};

struct PrincipledBSDF
{
    vec3 BaseColour;
    bool HasBaseColourSampler;

    float Subsurface;
    vec3 SubsurfaceColour;
    float SubsurfaceRadius;
    float SubsurfaceIOR;
    float SubsurfaceAnisotropy;

    float Metallic;
    float Specular;
    float SpecularTint;
    float Roughness;    
    float Anisotropic;
    float AnisotropicRotation;
    float Sheen;
    float SheenTint;
    float Clearcoat;
    float ClearcoatRoughness;
    float IOR;
    float Transmission;
    float TransmissionRoughness;
    float Emission;
    float EmissionRoughness;
    float Alpha;

    vec3 Normal;
    bool HasNormalSampler;

    vec3 ClearcoatNormal;
    vec3 Tangent;
};

struct Sampler
{
    sampler3D AmbientLightMap;

    sampler2D ShadowMap;
    // sampler2D DirectionalShadowMap;
    // sampler2D PointShadowMap;
    
    sampler2D BaseColourMap;
    sampler2D NormalMap;
};

in vec3 V_Position;
in vec3 V_Normal;
in vec2 V_UV;
in vec3 V_Colour;
in vec3 V_LightPosition;

layout(location = 0) out vec4 O_FragColour;

uniform AreaLight U_AreaLight;
uniform DirectionalLight U_DirectionalLight;
uniform PointLight U_PointLight[4];
uniform PrincipledBSDF U_BSDF;
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
    vec3 positionDirection = normalize(V_Position);
    vec3 normal = normalize(
        (U_BSDF.HasNormalSampler ? texture(U_Sampler.NormalMap, V_UV).xyz : U_BSDF.Normal)
        
    );

    // float directionalShadow = DiffuseWeight(normal, U_DirectionalLight.Direction);
    // vec3 directionalDiffuse = (U_DirectionalLight.Colour * U_DirectionalLight.Intensity);
    
    // // vec4 tex = texture(U_Sampler.Image, V_UV);
    // // vec3 ambientColour = tex.rgb * U_Material.Colour;
    // // vec3 diffuseColour = tex.rgb * U_Material.Colour;
    // // vec3 specularColour = tex.rgb * U_Material.Colour;
    // // vec3 ambient = tex.rgb * U_Material.Colour;
    // // vec3 diffuse = directionalShadow * directionalDiffuse;
    // // vec3 specular = vec3(0.0);
    // // float alpha = U_Material.Alpha * tex.a;
    


    // // vec3 pointDiffuse = Diffuse(U_PointLight.Position) * U_DirectionalLight.Diffuse;

    // vec3 material_ambient = U_BSDF.HasBaseColourSampler ? texture(U_Sampler.BaseColourMap, V_UV).rgb : U_BSDF.BaseColour;
    // vec3 light_ambient = U_AreaLight.HasColourMap ? texture(U_Sampler.AmbientLightMap, positionDirection).rgb : U_AreaLight.Colour;
    // vec3 ambient = material_ambient; // * light_ambient;
    // vec3 diffuse = U_DirectionalLight.Colour * U_DirectionalLight.Intensity;
    // vec3 specular = vec3(0.0);
    // float alpha = 1.0;

    // O_FragColour = U_AreaLight.Intensity * vec4(ambient + (directionalShadow * (diffuse + specular)), alpha);
    O_FragColour = vec4(1.0);
    // O_FragColour = vec4(U_AreaLight.Colour, 1.0);
    // O_FragColour = vec4(vec3(U_AreaLight.Intensity), 1.0);
}
