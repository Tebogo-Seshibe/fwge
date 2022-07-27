import { ShaderAsset } from "@fwge/render"
import basicFrag from '/public/shaders/Basic.frag?raw'
import defaultFrag from '/public/shaders/Default.frag?raw'
import defaultVert from '/public/shaders/Default.vert?raw'
import simpleFrag from '/public/shaders/Simple.frag?raw'
import commonFrag from '/public/shaders/_common.frag?raw'
import commonVert from '/public/shaders/_common.vert?raw'
import lightingVert from '/public/shaders/_lighting.vert?raw'
import lightingFrag from '/public/shaders/_lighting.frag?raw'
import LitAndShadowShadowShaderVert from '/public/shaders/LitAndShadowShader.vert?raw'
import LitAndShadowShadowShaderFrag from '/public/shaders/LitAndShadowShader.frag?raw'

export const basicShader = () => new ShaderAsset(
{
    vertexShader:
    {
        source: LitAndShadowShadowShaderVert,
        input: []
    },
    fragmentShader:
    {
        source: LitAndShadowShadowShaderFrag,
        input: []
    }
})
export const createSimpleShader = () => new ShaderAsset(
{
    vertexShader:
    {
        source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
        input: []
    },
    fragmentShader:
    {
        source: simpleFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
        input: []
    },
})

export const createBasicShader = () => new ShaderAsset(
{
    vertexShader:
    {
        source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
        input: []
    },
    fragmentShader:
    {
        source: basicFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
        input: []
    },
})
    
export const createDefaultShader = () => new ShaderAsset(
{
    vertexShader:
    {
        source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
        input: []
    },
    fragmentShader:
    {
        source: defaultFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
        input: []
    },
})