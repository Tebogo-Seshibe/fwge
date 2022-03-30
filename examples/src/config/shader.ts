import { Game } from "@fwge/core"
import { Colour4, Shader } from "@fwge/render"
import basicFrag from '../../assets/shaders/Basic.frag?raw'
import basicVert from '../../assets/shaders/Basic.vert?raw'
import defaultFrag from '../../assets/shaders/Default.frag?raw'
import defaultVert from '../../assets/shaders/Default.vert?raw'
import simpleFrag from '../../assets/shaders/Simple.frag?raw'
import simpleVert from '../../assets/shaders/Simple.vert?raw'

import commonFrag from '../../assets/shaders/_common.frag?raw'
import commonVert from '../../assets/shaders/_common.vert?raw'
import lightingFrag from '../../assets/shaders/_lighting.frag?raw'
import lightingVert from '../../assets/shaders/_lighting.vert?raw'

export function configureShaders(game: Game): void
{
    const shaderLibrary = game.GetLibrary(Shader)

    shaderLibrary.Add(
        'Simple',
        new Shader(
        {
            vertexSrc: simpleVert
                .replace('// common.vert', commonVert)
                .replace('// lighting.vert', lightingVert),
            fragmentSrc: simpleFrag
                .replace('// common.frag', commonFrag)
                .replace('// lighting.frag', lightingFrag),
            baseColour: new Colour4(0, 0, 0, 1),
            height: 1080,
            width: 1920,
        })
    )

    shaderLibrary.Add(
        'Basic',
        new Shader(
        {
            vertexSrc: basicVert
                .replace('// common.vert', commonVert)
                .replace('// lighting.vert', lightingVert),
            fragmentSrc: basicFrag
                .replace('// common.frag', commonFrag)
                .replace('// lighting.frag', lightingFrag),
            baseColour: new Colour4(0, 0, 0, 1),
            height: 1080,
            width: 1920,
        })
    )

    shaderLibrary.Add(
        'Default',
        new Shader(
        {
            vertexSrc: defaultVert
                .replace('// common.vert', commonVert)
                .replace('// lighting.vert', lightingVert),
            fragmentSrc: defaultFrag
                .replace('// common.frag', commonFrag)
                .replace('// lighting.frag', lightingFrag),
            baseColour: new Colour4(0, 0, 0, 1),
            height: 1080,
            width: 1920
        })
    )
}
