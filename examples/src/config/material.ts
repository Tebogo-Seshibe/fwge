import { Game } from '@fwge/core'
import { Colour4, Material } from '@fwge/render'

export function configureMaterials(game: Game): void
{
    const materialLibrary = game.GetLibrary(Material)

    materialLibrary.Add(
        'OBJ Cube',
        new Material(
        {
            ambient: new Colour4(0.25, 0.25, 0.25, 1),
            diffuse: new Colour4(0.75, 0.75, 0.75, 1),
            specular: new Colour4(1, 1, 1, 1),
            alpha: 1,
            shininess: 32,
            imagemap: 'assets/img/CubeUV.png'
        })
    )
    materialLibrary.Add(
        'Default',
        new Material(
        {
            ambient: new Colour4(0.25, 0.25, 0.25, 1),
            diffuse: new Colour4(0.75, 0.75, 0.75, 1),
            specular: new Colour4(1, 1, 1, 1),
            alpha: 1,
            shininess: 32,
            imagemap: 'assets/img/Tebogo.png'
        })
    )
}
