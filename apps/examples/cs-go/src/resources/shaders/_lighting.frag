struct Sampler
{
  sampler2D Image;
  sampler2D Bump;
  sampler2D Shadow;
};

struct AmbientLight 
{
    vec4 Colour;
    float Intensity;
};

struct DirectionalLight
{ 
    vec4 Colour;
    float Intensity;

    vec3 Diriection;
};

struct PointLight
{ 
    vec4 Colour;
    float Intensity;

    vec3 Position;
    float Radius;
    float Angle;
};

struct Material 
{
    vec4 Ambient;
    vec4 Diffuse;
    vec4 Specular;
    float Shininess;
    float Alpha;

    bool HasImageMap;
    bool HasBumpMap;
};

uniform AmbientLight U_AmbientLight;
uniform DirectionalLight U_DirectionalLight;
uniform PointLight U_PointLight[4];

uniform Sampler U_Sampler;
uniform Material U_Material;

vec4 AmbientLightColour()
{
    return U_AmbientLight.Colour * U_AmbientLight.Intensity;
}

// vec4 HemisphereLightColour = vec4(0.0);
// vec4 RectLightColour = vec4(0.0);

// vec4 DirectionalLightColour = vec4(0.0);
// vec4 SpotLightColour = vec4(0.0);

vec4 CalcPointLight(in PointLight point)
{                
    float falloff = smoothstep(point.Radius, 0.0, min(length(point.Position - V_Position.xyz), point.Radius));
    vec3 L = normalize(point.Position - V_Position.xyz);
    vec3 E = -V_Position.xyz;
    vec3 N = V_Normal;

    vec3 H = normalize(L + E);
    vec4 ambient = U_Material.Ambient;

    float Kd = max(dot(L, H), 0.0);
    vec4 diffuse = Kd * U_Material.Diffuse;

    float Ks = pow(max(dot(N, H), 0.0), U_Material.Shininess);
    vec4 specular = Ks * U_Material.Specular;

    if (dot(L, H) < 0.0)
    {
        specular = vec4(vec3(0.0), 1.0);
    }

    return vec4(
    (
            (ambient + diffuse + specular)
            * point.Colour
            * point.Intensity
            * falloff
        ).rgb,
    1.0);
}

// vec4 PointLightColour()
// {
//     return 
//         CalcPointLight(U_PointLight[0]) +
//         CalcPointLight(U_PointLight[1]) +
//         CalcPointLight(U_PointLight[2]) +
//         CalcPointLight(U_PointLight[3]);
// }