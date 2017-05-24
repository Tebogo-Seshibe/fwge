precision mediump float;
const int MAX_POINT = 8;

struct Material
{
    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;
    float Shininess;
    float Alpha;

    bool HasImage;
    bool HasBump;
    bool HasSpecular;
};
uniform Material U_Material;

struct AmbientLight
{
    vec3 Colour;
    float Intensity;
};
uniform AmbientLight U_Ambient;

struct DirectionalLight
{
    vec3 Colour;
    float Intensity;
    vec3 Direction;
};
uniform DirectionalLight U_Directional;

struct PointLight
{
    vec3 Colour;
    float Intensity;
    vec3 Position;
    float Radius;
    float Angle;
};
uniform PointLight U_Point[MAX_POINT];
uniform int U_Point_Count;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D Specular;
};
uniform Sampler U_Sampler;

varying vec4 V_Position;
varying vec3 V_Normal;
varying vec2 V_UV;
varying vec3 V_Colour;

vec3 Directional(in vec3 normal)
{
    float weight = max(dot(normal, normalize(U_Directional.Direction)), 0.0);
    vec3 colour = U_Material.Diffuse * U_Directional.Colour * weight;
    
    return colour * U_Directional.Intensity;
}

vec3 Point(in vec3 normal)
{
    vec3 points = vec3(0.0);
    
    for (int i = 0; i < MAX_POINT; ++i)
    {
        if (i < U_Point_Count)
        {
            PointLight point = U_Point[i];
            float distance = length(point.Position - V_Position.xyz);

            if (distance <= point.Radius)
            {
                vec3 colour = vec3(0.0);

                vec3 direction = normalize(point.Position - V_Position.xyz);
                vec3 eyeVector = normalize(-normal.xyz);
                vec3 reflection = reflect(direction, normal);
            
                float diffuse_weight = max(dot(normal, direction), 0.0);
                float specular_weight =  pow(max(dot(reflection, eyeVector), 0.0), U_Material.Shininess);

                colour = (U_Material.Diffuse * point.Colour * diffuse_weight + U_Material.Specular * specular_weight);
                colour = colour * (1.0 - (distance / point.Radius));
                colour = colour * point.Intensity;
                
                points += colour;
            }
        }
    }
    
    return points;
}

vec3 Light()
{
    vec3 Normal = normalize(U_Material.HasBump ? texture2D(U_Sampler.Bump, V_UV).xyz * V_Normal : V_Normal);       
    
    vec3 ambient = (U_Ambient.Colour * U_Ambient.Intensity);
    return ambient + Directional(Normal) + Point(Normal);
}

vec4 Colour()
{
    if (U_Material.HasImage)
        return texture2D(U_Sampler.Image, V_UV);
    else
       return vec4(V_Colour * U_Material.Ambient, 1.0);
}

vec3 Effect(in vec3 colour)
{
    return vec3
    (
        colour.r > 0.00 ? (colour.r > 0.25 ? (colour.r > 0.50 ? (colour.r > 0.75 ? 1.0 : 0.75) : 0.50) : 0.25) : 0.00,
        colour.g > 0.00 ? (colour.g > 0.25 ? (colour.g > 0.50 ? (colour.g > 0.75 ? 1.0 : 0.75) : 0.50) : 0.25) : 0.00,
        colour.b > 0.00 ? (colour.b > 0.25 ? (colour.b > 0.50 ? (colour.b > 0.75 ? 1.0 : 0.75) : 0.50) : 0.25) : 0.00
    );
}

void main(void)
{
    vec4 colour = Colour();
    vec3 light = Light();
    
    gl_FragColor = vec4(Effect(colour.rgb * light), U_Material.Alpha * colour.a);
}