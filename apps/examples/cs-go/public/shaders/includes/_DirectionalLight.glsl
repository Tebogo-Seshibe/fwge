struct DirectionalLight
{
    vec3 Colour;
    float Intensity;
    
    vec3 Direction;
    bool CastShadows;
    
    float TexelSize;
    float TexelCount;
    float Bias;
    float PCFLevel;

    mat4 ShadowMatrix;
};
DirectionalLight[] DirectionalLights;

struct _DirectionalLightData
{
    vec4 Data0;
    vec4 Data1;
    vec4 Data2;
    mat4 Data3;
};

uniform DirectionalLightBuffer
{
    _DirectionalLightData[] _DirectionalLight;
};

void _Init_DirectionalLights()
{
    DirectionalLights = DirectionalLight[DIRbuffers.length()];

    for (int i = 0; i < DIRbuffers.length())
    {
        DirectionalLights[i].Colour = _DirectionalLight[i].Data0.xyz;
        DirectionalLights[i].Intensity = _DirectionalLight[i].Data0.w;
        DirectionalLights[i].Direction = _DirectionalLight[i].Data1.xyz;
        DirectionalLights[i].CastShadows = bool(_DirectionalLight[i].Data1.w);
        DirectionalLights[i].TexelSize = _DirectionalLight[i].Data2.x;
        DirectionalLights[i].TexelCount = _DirectionalLight[i].Data2.y;
        DirectionalLights[i].Bias = _DirectionalLight[i].Data2.z;
        DirectionalLights[i].PCFLevel = _DirectionalLight[i].Data2.w;
        DirectionalLights[i].ShadowMatrix = _DirectionalLight[i].Data3;
    }
}

void _Calculate_DirectionalLight(DirectionalLight dir, vec3 fragmentNormal, bool receiveShadows, vec3 shadowCoordinates)
{
    float lightingAmount = dot(normal, -dir.Direction);
    float diffuseIntensity = max(lightingAmount, 0.0);

    if (dir.CastShadows && receiveShadows)
    {
        float bias = max(dir.Bias * (1.0 - diffuseDot), 0.005);
        vec2 fragUV = shadowCoordinates.xy;
        float fragmentDepth = shadowCoordinates.z;

        float total = 0.0;
        for (float x = -dir.PCFLevel; x <= dir.PCFLevel; ++x)
        {
            for (float y = -dir.PCFLevel; y <= dir.PCFLevel; ++y)
            {
                vec2 offset = vec2(x, y) * dir.TexelSize;
                vec2 uv = fragUV + offset;
                float shadowDepth = texture(U_Sampler.DirectionalShadow, uv).r + bias;

                if (shadowDepth < fragmentDepth)
                {
                    total += 1.0f;
                }
            }
        }

        diffuseIntensity *= 1.0f - (total / dir.TexelCount);
    }

    return dir.Colour * diffuseIntensity * dir.Intensity;
}

vec3 CalculateDirectionalLight(vec3 fragmentNormal, bool receiveShadows, vec3 shadowCoordinates)
{
    Init_DirectionalLights();
    
    vec3 colour = vec3(0.0f);

    for (int i = 0; i < DirectionalLights.length(); ++i)
    {
        DirectionalLight dir = DirectionalLights[i];
        
        if (dir.Intensity <= 1.0f)
        {
            colour += _CalculateDirectionalLight(dir, fragmentNormal, receiveShadows, shadowCoordinates);
        }
    }

    return colour;
}
