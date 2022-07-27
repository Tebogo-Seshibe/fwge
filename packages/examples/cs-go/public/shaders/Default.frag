#version 300 es
precision mediump float;

const int MAX_LIGHTS = 4;

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
  vec3 Position;
  vec4 Colour;
  float Intensity;
  float Radius;
  float Angle;
};
uniform PointLight U_Point[MAX_LIGHTS];
uniform int U_Point_Count;

struct Sampler
{
  sampler2D Image;
  sampler2D Bump;
  sampler2D Shadow;
};
uniform Sampler U_Sampler;

// common.frag

vec4 CalcPointLight(in PointLight point)
{                
    float falloff = smoothstep(
        point.Radius,
        0.0,
        min(length(point.Position - V_Position.xyz), point.Radius)
    );
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

vec4 Light()
{
    vec4 light = vec4(0.0);
    
    light += CalcPointLight(U_Point[0]);
    light += CalcPointLight(U_Point[1]);
    light += CalcPointLight(U_Point[2]);
    light += CalcPointLight(U_Point[3]);

    return vec4(1.0);
    return light;
}

vec4 Colour()
{
    vec4 colour = vec4(1.0);

    if (U_Material.HasImageMap)
    {
        colour = texture(U_Sampler.Image, V_UV);
    }
    else
    {
        colour = V_Colour;
    }

    return colour;
}

void main()
{ 
    OutColour = vec4(1.0); //vec4((/*Colour() */ Light()).rgb, U_Material.Alpha);
}
