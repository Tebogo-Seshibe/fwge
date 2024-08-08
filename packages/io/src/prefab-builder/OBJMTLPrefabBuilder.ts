import { BasicLitMaterial, Game, MeshRenderer, Prefab, Tag, Transform } from "@fwge/core"
import { MTL, OBJ } from "../loader"

export const OBJMTLPrefabBuilder = (game: Game, obj: OBJ, mtl: MTL): Prefab<any> =>
{
    const root = new Prefab().AddComponent(new Transform(game))

    const objects = Object.keys(obj)
    if (objects.length === 1)
    {
        root.AddComponent(new MeshRenderer(game, { asset: obj[objects[0]].mesh }))
        root.AddComponent(mtl[obj[objects[0]].material])
    }
    else
    {
        for (let i = 0; i < objects.length; ++i)
        {
            root.AddChild(new Prefab()
                .AddComponent(new Transform(game))
                .AddComponent(new MeshRenderer(game, { asset: obj[objects[i]].mesh }))
                .AddComponent(mtl[obj[objects[i]].material])
                .AddComponent(new Tag(game, objects[i]))
            )

        }
    }

    return root
}
