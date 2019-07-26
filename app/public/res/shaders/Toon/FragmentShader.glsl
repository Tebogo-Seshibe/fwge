precision mediump float;
const int MAX_LIGHTS = 8;


struct AmbientLight
{
	vec3 colour;
	float intensity;
};

struct DirectionalLight
{
	vec3 direction;
	vec3 colour;
	float intensity;
};

struct PointLight
{
	vec3 position;
	vec3 colour;
	float shininess;
	float intensity;
    float radius;
};

struct SpotLight
{
	vec3 direction;
	vec3 position;
	vec3 colour;
	float angle;
	float shininess;
	float intensity;
};


struct Material
{
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float alpha;
    
    bool useLight;
    bool useTexture;
    bool useBumpMap;
    bool useShadowMap;
};


uniform AmbientLight uAmbient;
uniform DirectionalLight uDirectional;
uniform PointLight uPoint[MAX_LIGHTS];
uniform int uPointCount;
uniform SpotLight uSpot[MAX_LIGHTS];
uniform int uSpotCount;

uniform Material uMaterial;
uniform sampler2D uSampler;
uniform sampler2D uBumpSampler;
uniform sampler2D uShadowSampler;

varying vec2 vVertexUV;
varying vec3 vNormalVector;
varying vec4 vVertexPosition;
varying vec4 vVertexColour;
varying vec4 vShadowPosition;

vec3 Directional(in vec3 normal)
{
    float weight = max(dot(normal, uDirectional.direction), 0.0);
    vec3 colour = uMaterial.diffuse * uDirectional.colour * weight;
    
    return colour * uDirectional.intensity;
}

vec3 Point(in vec3 normal)
{
    vec3 points = vec3(0.0);
    
    for (int i = 0; i < MAX_LIGHTS; ++i)
    {
        if (i < uPointCount)
        {
            PointLight point = uPoint[i];
            float distance = length(point.position - vVertexPosition.xyz);

            if (distance <= point.radius)
            {
                vec3 colour = vec3(0.0);

                vec3 direction = normalize(point.position - vVertexPosition.xyz);
                vec3 eyeVector = normalize(-normal.xyz);
                vec3 reflection = reflect(direction, normal);
            
                float diffuse_weight = max(dot(normal, direction), 0.0);
                float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), point.shininess);

                colour = (uMaterial.diffuse * point.colour * diffuse_weight + uMaterial.specular * specular_weight);
                colour = colour * (1.0 - (distance / point.radius));
                colour = colour * point.intensity;
                
                points += colour;
            }
        }
    }
    
    return points;
}

vec3 Spot(in vec3 normal)
{
    vec3 spots = vec3(0.0);
    
    for (int i = 0; i < MAX_LIGHTS; ++i)
    {
        if (i < uSpotCount)
        {
            SpotLight spot = uSpot[i];
            vec3 direction = normalize(spot.position - vVertexPosition.xyz);
            float angle_weight = pow(dot(spot.direction, direction), 2.0);
            
            if (angle_weight >= cos(spot.angle))
            {
                vec3 colour = vec3(0.0);
                
                vec3 eyeVector = normalize(-normal.xyz);
                vec3 reflection = reflect(direction, normal);

                float diffuse_weight = max(dot(normal, direction), 0.0);
                float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), spot.shininess);

                colour = (uMaterial.diffuse * spot.colour * diffuse_weight + uMaterial.specular * specular_weight);
                colour = colour * spot.intensity;
                
                spots += colour;
            }
        }
    }
    
    return spots;
}

vec3 Light()
{
	if (uMaterial.useLight)
	{
		vec3 newNormal = uMaterial.useBumpMap
						? texture2D(uBumpSampler, vVertexUV).xyz * vNormalVector
						: vNormalVector;

		vec3 vertexNormal = normalize(newNormal);
        	
		
        vec3 ambient = (uAmbient.colour * uAmbient.intensity);
		return ambient + Directional(newNormal) + Point(vertexNormal) + Spot(vertexNormal);
	}

	else
        return uMaterial.ambient.rgb;
}


vec4 Colour()
{
	if (uMaterial.useShadowMap && texture2D(uShadowSampler, vShadowPosition.xy).z < vShadowPosition.z)
		return vec4(0.0, 0.0, 0.0, 1.0);

	if (uMaterial.useTexture)
		return texture2D(uSampler, vVertexUV);
    
	return vVertexColour;
}

vec3 Effect(in vec3 colour, in vec3 light)
{
    float l = length(light);
    float scale = 1.0;
    
    if (l >= 0.8) scale = 1.0;	
	else if (l >= 0.6) scale = 0.6;
	else if (l >= 0.4) scale = 0.4;
	else if (l >= 0.2) scale = 0.2;
	else scale = 0.0;
    
    light = light * scale;

	return colour * light;
}

void main(void)
{
	vec4 colour = Colour();
	vec3 light = Light();

	gl_FragColor = vec4(Effect(colour.rgb, light), uMaterial.alpha);
}