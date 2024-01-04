import { Shader } from "@fwge/core"
import basicFrag from '/src/resources//shaders/Basic.frag?raw'
import defaultFrag from '/src/resources//shaders/Default.frag?raw'
import defaultVert from '/src/resources//shaders/Default.vert?raw'
import LitAndShadowShadowShaderFrag from '/src/resources//shaders/LitAndShadowShader.frag?raw'
import LitAndShadowShadowShaderVert from '/src/resources//shaders/LitAndShadowShader.vert?raw'
import LitAndShadowShadowShaderFrag2 from '/src/resources//shaders/LitAndShadowShader2.frag?raw'
import LitAndShadowShadowShaderVert2 from '/src/resources//shaders/LitAndShadowShader2.vert?raw'
import simpleFrag from '/src/resources//shaders/Simple.frag?raw'
import commonFrag from '/src/resources//shaders/_common.frag?raw'
import commonVert from '/src/resources//shaders/_common.vert?raw'
import lightingFrag from '/src/resources//shaders/_lighting.frag?raw'
import lightingVert from '/src/resources//shaders/_lighting.vert?raw'
import constants from '/src/resources//shaders/constants.vert?raw'

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
