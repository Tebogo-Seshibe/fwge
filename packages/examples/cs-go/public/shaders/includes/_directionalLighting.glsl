uniform DirectionalLight
{
    vec3 DL_COLOUR;
    float DL_INTENSITY;
    
    vec3 DL_DIRECTION;
    uint DL_CASTS_SHADOWS_MODE;
    // CAST MODE
    // 0: NONE
    // 1: BASIC
    // 2: PCF
    
    vec4 DL_DATA;
    // float TexelSize;
    // float TexelCount;
    // float Bias;
    // float PCFLevel;

    mat4 DL_SHADOW_MATRIX;
} directionalLight;

uniform sampler2D DL_SHADOW_SAMLPER;

float DL_BASIC(vec4 lightData)
{
    float bias = DL_DATA[2];

    vec3 lightPosition = (lightData.xyz / lightData.w) * 0.5 + 0.5;
    vec2 fragUV = lightPosition.xy;
    float fragmentDepth = lightPosition.z;
    float shadowDepth = texture(DL_SHADOW_SAMLPER, fragUV).r + bias;

    return (shadowDepth < fragmentDepth) ? 1.0 : 0.0;
}

float DL_PCF(vec4 lightData)
{    
    float texelSize = directionalLight.Data[0];
    float texelCount = directionalLight.Data[1];
    float bias = directionalLight.Data[2];
    float pcfLevel = directionalLight.Data[3];

    vec3 lightPosition = (lightData.xyz / lightData.w) * 0.5 + 0.5;
    vec2 fragUV = lightPosition.xy;
    float fragmentDepth = clamp(lightPosition.z, 0.0, 1.0);

    float total = 0.0;
    for (float x = -pcfLevel; x <= pcfLevel; ++x)
    {
        for (float y = -pcfLevel; y <= pcfLevel; ++y)
        {
            vec2 offset = vec2(x, y) * texelSize;
            float shadowDepth = texture(DL_SHADOW_SAMLPER, fragUV + offset).r + bias;

            if (shadowDepth < fragmentDepth)
            {
                total += 1.0;
            }
        }
    }
    return total / texelCount;
}

vec3 DL_CALCULATE(vec3 fragNormal, vec4 lightData)
{
    float diffuseWeight = dot(fragNormal, -DL_DIRECTION);
    float diffuse = max(diffuseWeight, 0.0);
    float shadow = 1.0;
    
    switch (DL_CASTS_SHADOWS_MODE)
    {
        case 0:
            break;
        case 1:
            shadow -= DL_BASIC(lightData);
            break;
        case 2:
            shadow -= DC_PCF(lightData);
            break;
    }

    return DL_COLOUR * diffuse * DL_INTENSITY * shadow;
}
