precision mediump float;
const int MAX_LIGHTS = 8;

uniform vec4 U_MaterialAmbient;
uniform vec4 U_MaterialDiffuse;
uniform vec4 U_MaterialSpecular;
uniform float U_MaterialShininess;
uniform float U_MaterialAlpha;
uniform bool U_MaterialHasImage;
uniform bool U_MaterialHasBump;
uniform bool U_MaterialHasSpecular;

uniform vec4 U_AmbientColour;
uniform float U_AmbientIntensity;

uniform vec3 U_DirectionalDirection;
uniform vec4 U_DirectionalColour;
uniform float U_DirectionalIntensity;

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

uniform sampler2D U_SamplerImage;
uniform sampler2D U_SamplerBump;
uniform sampler2D U_SamplerShadow;

varying vec4 V_Colour;
varying vec2 V_UV;
varying vec3 V_Normal;
varying vec4 V_Position;
varying vec4 V_Shadow;

vec4 Ambient()
{
    return U_MaterialAmbient * U_AmbientColour * U_AmbientIntensity;
}

vec4 Directional(in vec3 normal) 
{ 
    float weight = max(dot(normal, normalize(U_DirectionalDirection)), 0.0);
    vec4 diffuse = U_DirectionalColour * weight;
    
    return U_MaterialDiffuse * diffuse * U_DirectionalIntensity;
} 

vec4 Point(in vec3 normal)
{
    vec4 points = vec4(0.0);

    for (int i = 0; i < MAX_LIGHTS; ++i)
    {
        if (i < U_Point_Count)
        {
            PointLight point = U_Point[i];
            float distance = length(point.Position - V_Position.xyz);

            if (distance <= point.Radius)
            {
                vec4 colour = vec4(0.0);
                vec3 direction = normalize(point.Position - V_Position.xyz);
                vec3 eyeVector = normalize(-normal.xyz);
                vec3 reflection = reflect(direction, normal);
                
                float diffuse_weight = max(dot(normal, direction), 0.0);
                float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_MaterialShininess);

                colour = U_MaterialDiffuse * point.Colour * diffuse_weight + U_MaterialSpecular * specular_weight;
                colour = colour * (1.0 - (distance / point.Radius));
                colour = colour * point.Intensity;
                points += colour;
            } 
        } 
        else break;
    } 
    
    return points;
}

vec4 Light()
{
    vec3 normal = normalize(U_MaterialHasBump
                            ? texture2D(U_SamplerBump, V_UV).xyz * V_Normal
                            : V_Normal);

    return Ambient() + Directional(normal) + Point(normal);
}

vec4 Shadow()
{                
    return vec4(1.0);
}

vec4 Colour()
{
    vec4 colour = Shadow();
    
    if (U_MaterialHasImage)
    {
        colour = texture2D(U_SamplerImage, V_UV);
    }
    
    return colour;
}

void main(void)
{ 
    vec4 colour = Colour() * Light();
    colour.a *= U_MaterialAlpha;
    
    gl_FragColor = colour;
}