precision mediump float;
const int MAX_POINT = 8;

struct Material
{
    vec4    Ambient;
    vec4    Diffuse;
    vec4    Specular;
    float   Shininess;
    float   Alpha;

    bool    HasImage;
    bool    HasBump;
    bool    HasSpecular;
};
uniform Material U_Material;

struct AmbientLight
{
    vec4    Colour;
    float   Intensity;
};
uniform AmbientLight U_Ambient;

struct DirectionalLight
{
    vec4    Colour;
    float   Intensity;
    vec3    Direction;
};
uniform DirectionalLight U_Directional;

struct PointLight
{
    vec4    Colour;
    float   Intensity;
    vec3    Position;
    float   Radius;
    float   Angle;
};
uniform PointLight U_Point[MAX_POINT];
uniform int U_Point_Count;

struct Sampler
{
    sampler2D   Image;
    sampler2D   Bump;
    sampler2D   Specular;
};
uniform Sampler U_Sampler;

varying vec4 V_Position;
varying vec3 V_Normal;
varying vec3 V_Colour;
varying vec2 V_UV;

vec3 Directional(in vec3 normal)
{
    float weight = max(dot(normal, normalize(U_Directional.Direction)), 0.0);
    vec3 colour = U_Material.Diffuse.rgb * (U_Directional.Colour.rgb * weight);
    
    return colour * U_Directional.Intensity;
}

vec3 Point(in vec3 normal, in float intensity)
{
    vec3 points = vec3(0.0);
    
    for (int i = 0; i < MAX_POINT; ++i)
    {
        if (i < U_Point_Count)
        {
            PointLight point = U_Point[i];
            float distance = length(point.Position - V_Position.xyz);

            if (distance < point.Radius)
            {
                vec3 colour = vec3(0.0);

                vec3 direction = normalize(point.Position - V_Position.xyz);
                vec3 eyeVector = normalize(-normal.xyz);
                vec3 reflection = reflect(direction, normal);

                float diffuse_weight = max(dot(normal, direction), 0.0);
                float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_Material.Shininess * intensity);

                colour = (U_Material.Diffuse.rgb * point.Colour.rgb * diffuse_weight + U_Material.Specular.rgb * specular_weight);
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
    vec3 Normal = V_Normal;
    float Intensity = 1.0;

    if (U_Material.HasBump)
        Normal *= texture2D(U_Sampler.Bump, vec2(V_UV.s, V_UV.t)).xyz;

    if (U_Material.HasSpecular)
        Intensity = texture2D(U_Sampler.Specular, vec2(V_UV.s, V_UV.t)).r;

    Normal = normalize(Normal);
    
    vec3 Ambient = (U_Ambient.Colour.rgb * U_Ambient.Intensity);
    
    return Ambient + Directional(Normal) + Point(Normal, Intensity);
}

vec4 Colour(in vec3 light)
{
    if (U_Material.HasImage)
        return texture2D(U_Sampler.Image, vec2(V_UV.s, V_UV.t)) * vec4(light, 1.0);

	return U_Material.Ambient + vec4(light, 0.0);
}

void main(void)
{
    vec3 light  = Light();
    vec4 colour = Colour(light);
    
    gl_FragColor = vec4(colour.rgb, U_Material.Alpha * colour.a);
}
