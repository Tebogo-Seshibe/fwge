import { Game, Shader, Tag, Transform } from "@fwge/core";
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io";
import de_dust2_MTL from '/public/objects/de_dust2_mat/de_dust2.mtl?raw';
import de_dust2_OBJ from '/public/objects/de_dust2_mat/de_dust2.obj?raw';

export function DeDust2OBJ(game: Game)
{
    return OBJMTLPrefabBuilder(
        OBJLoader(de_dust2_OBJ),
        MTLLoader(de_dust2_MTL, game.GetAsset('Basic Shader', Shader))
    )
    .AddComponent(new Tag('De_Dust 2'))
    .AddComponent(new Transform());
}
