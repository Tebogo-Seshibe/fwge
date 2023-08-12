import { Shader } from "@fwge/core"
import basicFrag from '$lib/res/shaders/Basic.frag?raw'
import defaultFrag from '$lib/res/shaders/Default.frag?raw'
import defaultVert from '$lib/res/shaders/Default.vert?raw'
import LitAndShadowShadowShaderFrag from '$lib/res/shaders/LitAndShadowShader.frag?raw'
import LitAndShadowShadowShaderVert from '$lib/res/shaders/LitAndShadowShader.vert?raw'
import LitAndShadowShadowShaderFrag2 from '$lib/res/shaders/LitAndShadowShader2.frag?raw'
import LitAndShadowShadowShaderVert2 from '$lib/res/shaders/LitAndShadowShader2.vert?raw'
import simpleFrag from '$lib/res/shaders/Simple.frag?raw'
import commonFrag from '$lib/res/shaders/_common.frag?raw'
import commonVert from '$lib/res/shaders/_common.vert?raw'
import lightingFrag from '$lib/res/shaders/_lighting.frag?raw'
import lightingVert from '$lib/res/shaders/_lighting.vert?raw'
import constants from '$lib/res/shaders/constants.vert?raw'

Shader.Includes.set('constants.vert', constants)
Shader.Includes.set('common.vert', commonVert)
Shader.Includes.set('common.frag', commonFrag)
Shader.Includes.set('lighting.vert', lightingVert)
Shader.Includes.set('lighting.frag', lightingFrag)

export const basicShader = () => new Shader(
    LitAndShadowShadowShaderVert,
    LitAndShadowShadowShaderFrag
)

export const basicShader2 = () => new Shader(
    LitAndShadowShadowShaderVert2,
    LitAndShadowShadowShaderFrag2
)

export const createSimpleShader = () => new Shader(
    defaultVert,
    simpleFrag
)

export const createBasicShader = () => new Shader(
    defaultVert,
    basicFrag
)
    
export const createDefaultShader = () => new Shader(
    defaultVert,
    defaultFrag
)
