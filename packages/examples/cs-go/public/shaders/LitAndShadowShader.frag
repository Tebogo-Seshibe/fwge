#version 300 es

precision highp float;

in vec4 V_Position;
in vec3 V_Normal;
in vec2 V_UV;
in vec4 V_Colour;
in vec4 V_LightPosition;
in vec3[4] V_LightPositions;

layout(location = 0) out vec4 O_FragColour;            
layout(location = 1) out vec4 O_Other;            
                    
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
uniform Material U_Material;

struct PointLight
{ 
    vec4 Colour;
    float Intensity;

    vec3 Position;
    float Radius;
    float Angle;
};
uniform PointLight U_PointLight[4];

struct DirectionalLight
{ 
    vec4 Colour;
    float Intensity;
    vec3 Direction;
};
uniform DirectionalLight U_DirectionalLight;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D Shadow;
};
uniform Sampler U_Sampler;
uniform sampler2D U_ShadowMap;


vec4 CalcPointLight(in PointLight point)
{
    vec3 D = point.Position - V_Position.xyz;
    vec3 L = normalize(D);
    vec3 E = -V_Position.xyz;
    vec3 N = V_Normal;
    vec3 H = normalize(L + E);
    
    float halfway = dot(L, H);
    float Kd = max(halfway, 0.0);
    float Ks = pow(max(dot(N, H), 0.0), U_Material.Shininess);
    float falloff = 1.0; //smoothstep(point.Radius, 0.0, min(length(D), point.Radius));
    
    vec4 ambient = U_Material.Ambient;
    vec4 diffuse = Kd * U_Material.Diffuse;
    vec4 specular = halfway < 0.0
        ? vec4(0.0, 0.0, 0.0, 1.0)
        : Ks * U_Material.Specular;

    // return vec4(specular.rgb, 1.0);
    return (
        (ambient + diffuse + specular)
        * point.Colour
        * point.Intensity
        * falloff
    );
}

vec4 PointLightColour()
{
    return 
        CalcPointLight(U_PointLight[0]) +
        CalcPointLight(U_PointLight[1]) +
        CalcPointLight(U_PointLight[2]) +
        CalcPointLight(U_PointLight[3]);
}

float calculateShadow()
{
    vec3 position = V_LightPosition.xyz * 0.5 + 0.5;
    if (position.z > 1.0)
    {
        position.z = 1.0;
    }
    float depth = texture(U_ShadowMap, position.xy).r;
    float bias = 0.05;
    return (depth + bias) < position.z ? 0.0 : 1.0;
}

vec4 DirectionalLightColour() 
{ 
    
    float weight = max(dot(V_Normal, normalize(U_DirectionalLight.Direction)), 0.0);
    vec4 diffuse = U_DirectionalLight.Colour * weight;
    
    return U_Material.Diffuse * diffuse * (calculateShadow() * U_DirectionalLight.Intensity);
} 


vec4 Colour()
{
    if (U_Material.HasImageMap)
    {
        return texture(U_Sampler.Image, V_UV);
    }
    else
    {
        return vec4(0.0);
    }
}

void main(void)
{
    // vec3 position = V_LightPosition.xyz * 0.5 + 0.5;
    // O_FragColour = texture(U_ShadowMap, position.xy);
    O_FragColour = /* PointLightColour() */ DirectionalLightColour() * (Colour() + U_Material.Ambient);
    // O_FragColour = V_LightPosition.wwww;
    O_Other = vec4(1.0,0.0,0.0,1.0);
}
