import { Game, Shader, Tag, Transform } from '@fwge/core';
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from '@fwge/io';
import sponzaMTL from '/public/objects/sponza/sponza.mtl?raw';
import sponzaOBJ from '/public/objects/sponza/sponza.obj?raw';

export const SponzaOBJ = (game: Game) => OBJMTLPrefabBuilder(
    OBJLoader(sponzaOBJ),
    MTLLoader(sponzaMTL, game.GetAsset('Basic Shader', Shader))
)
.AddComponent(new Tag('Sponza'))
.AddComponent(new Transform({ scale: [5,5,5] }));
