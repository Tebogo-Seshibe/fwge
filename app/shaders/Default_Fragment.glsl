precision mediump float;
const int MAX_LIGHTS = 8;

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

struct AmbientLight 
{
    vec3 Colour;
    float Intensity;
};
uniform AmbientLight U_Ambient;

struct DirectionalLight
{
    vec3 Direction;
    vec3 Colour;
    float Intensity;
};
uniform DirectionalLight U_Directional;

struct PointLight
{ 
    vec3 Position;
    vec3 Colour;
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

varying vec4 V_Colour;
varying vec2 V_UV;
varying vec3 V_Normal;
varying vec4 V_Position;
varying vec4 V_Shadow;

vec3 Ambient()
{
    return U_Material.Ambient.rgb * (U_Ambient.Colour * U_Ambient.Intensity);
}

vec3 Directional(in vec3 normal) 
{ 
    float weight = max(dot(normal, normalize(U_Directional.Direction)), 0.0);
    vec3 diffuse = U_Directional.Colour * weight;
    
    return U_Material.Diffuse.rgb * diffuse * U_Directional.Intensity;
} 

vec3 Point(in vec3 normal)
{
    vec3 points = vec3(0.0);

    for (int i = 0; i < MAX_LIGHTS; ++i)
    {
        if (i < U_Point_Count)
        {
            PointLight point = U_Point[i];
            float distance = length(point.Position - V_Position.xyz);

            if (distance <= point.Radius)
            {
                vec3 direction = normalize(point.Position - V_Position.xyz);
                vec3 eyeVector = normalize(-normal.xyz);
                vec3 reflection = reflect(direction, normal);
                
                float diffuse_weight = max(dot(normal, direction), 0.0);
                float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_Material.Shininess);

                vec3 colour = (U_Material.Diffuse.rgb * point.Colour * diffuse_weight) + (U_Material.Specular.rgb * specular_weight);
                /*colour *= (1.0 - (distance / point.Radius));
                colour *= point.Intensity;*/
                points += colour;
            } 
        } 
        else break;
    }
    
    return points;
}

vec3 Light()
{
    vec3 normal = normalize(/*U_Material.HasBumpMap
                            ? texture2D(U_Sampler.Bump, V_UV).xyz
                            : */V_Normal);

    return (Ambient() + Directional(normal) + Point(normal)).rgb;
}

vec4 Colour()
{
    /*if (U_Material.HasImageMap)
        return texture2D(U_Sampler.Image, V_UV);
    else*/
        return V_Colour;
}

void main(void)
{
    vec4 colour = Colour();
    gl_FragColor = vec4(U_Material.Diffuse.rgb, 1.0 - colour.a);
}