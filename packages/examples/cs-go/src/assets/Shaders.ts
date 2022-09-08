import { Shader } from "@fwge/core"
import basicFrag from '/public/shaders/Basic.frag?raw'
import defaultFrag from '/public/shaders/Default.frag?raw'
import defaultVert from '/public/shaders/Default.vert?raw'
import LitAndShadowShadowShaderFrag from '/public/shaders/LitAndShadowShader.frag?raw'
import LitAndShadowShadowShaderVert from '/public/shaders/LitAndShadowShader.vert?raw'
import LitAndShadowShadowShaderFrag2 from '/public/shaders/LitAndShadowShader2.frag?raw'
import LitAndShadowShadowShaderVert2 from '/public/shaders/LitAndShadowShader2.vert?raw'
import simpleFrag from '/public/shaders/Simple.frag?raw'
import commonFrag from '/public/shaders/_common.frag?raw'
import commonVert from '/public/shaders/_common.vert?raw'
import lightingFrag from '/public/shaders/_lighting.frag?raw'
import lightingVert from '/public/shaders/_lighting.vert?raw'

export const basicShader = () => new Shader(
    LitAndShadowShadowShaderVert,
    LitAndShadowShadowShaderFrag
)

export const basicShader2 = () => new Shader(
    LitAndShadowShadowShaderVert2,
    LitAndShadowShadowShaderFrag2
)

export const createSimpleShader = () => new Shader(
    defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
    simpleFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag)
)

export const createBasicShader = () => new Shader(
    defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
    basicFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag)
)
    
export const createDefaultShader = () => new Shader(
    defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
    defaultFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag)
)