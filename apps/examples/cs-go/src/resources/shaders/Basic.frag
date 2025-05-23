#version 300 es
precision mediump float;

//#include common.frag
//#include lighting.frag

vec4 MyCalcPointLight(PointLight point)
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

vec4 Colour()
{
    if (U_Material.HasImageMap)
    {
        return texture(U_Sampler.Image, V_UV);
    }
    else
    {
        return V_Colour;
    }
}

void main()
{ 
    vec4 col = Colour();
    float alpha = U_Material.Alpha * col.a;

    OutColour = vec4(col.rgb * Light().rgb, alpha);
}
