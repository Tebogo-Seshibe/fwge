#version 300 es
precision highp float;

// common.frag
// lighting.frag

void main(void)
{
    OutColour = vec4(V_Position.w);
    // V_Colour * (
    //     U_Material.HasImageMap
    //     ? texture(U_Sampler.Image, V_UV)
    //     : U_Material.Ambient
    // );
}
