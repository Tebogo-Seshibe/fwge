import { Game } from '@fwge/core'
import { Colour4, Material } from '@fwge/render'

export function configureMaterials(game: Game): void
{
    const materialLibrary = game.GetLibrary(Material)

    materialLibrary.Add(
        'Default',
        new Material(
        {
            ambient: new Colour4(1, 1, 1, 1),
            diffuse: new Colour4(1, 1, 1, 1),
            specular: new Colour4(1, 1, 1, 1),
            alpha: 1,
            shininess: 32,
            imagemap: 'img/Tebogo.png'
        })
    )
}
