import { Game } from "@fwge/core"

export function cameraControlScene(game: Game, _: HTMLElement)
{
    const scene = game.CreateScene()
    // const meshLibrary = game.GetLibrary(Mesh)
    // const materialLibrary = game.GetLibrary(Material)
    // const scriptLibrary = game.GetLibrary(Script)

    // scene.UseSystem(InputSystem)
    //   .UseSystem(ScriptSystem)
    //   .UseSystem(RenderSystem)
    //   .UseSystem(FrameCounter, fpsCounter)
    
    // const shaderAsset = new ShaderAsset(
    // {
    //     vertexShader:
    //     {
    //         source: simpleVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
    //         input:
    //         [
    //             new ShaderInput(ShaderBool, 'Hello',  entity => entity.Id)
    //         ]
    //     },
    //     fragmentShader:
    //     {
    //         source: simpleFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
    //         input: []
    //     }
    // })
    // const hmm = new OBJParser()
    // const [ prefab ] = hmm.hmm(obj, mtl)
    // prefab.material.Shader = shaderAsset
    // console.log(prefab.mesh)
    // console.log(prefab.material)
    // console.log(materialLibrary.Get('Default'))
    
    // scene.CreateEntity(Light, new Colour4(1.0, 0.0, 0.0, 1.0), radian(0))
    // scene.CreateEntity(Light, new Colour4(0.0, 1.0, 0.0, 1.0), radian(90))
    // scene.CreateEntity(Light, new Colour4(0.0, 0.0, 1.0, 1.0), radian(180))
    // scene.CreateEntity(Light, new Colour4(1.0, 0.0, 1.0, 1.0), radian(270))

    // scene.CreateEntity(FPSController)
    // const parent = scene.CreateEntity().AddComponent(new Transform())
    // for (let i = 0; i < 1000; ++i)
    // {
    //     const child = scene.CreateEntity(Cube,
    //     {
    //         mesh: prefab.mesh,
    //         material: prefab.material,
    //         script: scriptLibrary.Get('Rotator'),
    //         transform: new Transform(
    //         {
    //             position: new Vector3(
    //                 randBetween(-10, 10),
    //                 randBetween(-5, 5),
    //                 randBetween(-5, -25)
    //             )
    //         }),
    //     })
    //     parent.AddChild(child)
    // }

    return scene
}
