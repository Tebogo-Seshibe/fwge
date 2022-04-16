#version 300 es
precision mediump float;

// common.frag
// lighting.frag

vec4 MyCalcPointLight(in PointLight point)
{
    float falloff = smoothstep(point.Radius, 0.0, min(length(point.Position - V_Position.xyz), point.Radius));
    return vec4(vec3(falloff), 1.0);
}

vec4 Light()
{
    vec4 light = vec4(0.0);
    
    light += MyCalcPointLight(U_PointLight[0]);
    light += MyCalcPointLight(U_PointLight[1]);
    light += MyCalcPointLight(U_PointLight[2]);
    light += MyCalcPointLight(U_PointLight[3]);

    return light;
}

void main()
{ 
    OutColour = vec4(Light().rgb, U_Material.Alpha);
}
