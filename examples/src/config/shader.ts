import { Entity, Game } from "@fwge/core"
import { Attribute, Colour4, DynamicMesh, Material, Mesh, Shader, Uniform } from "@fwge/render"
import { ShaderBool, ShaderFloat, ShaderVec2, ShaderVec3, ShaderVec4 } from "@fwge/render/lib/components/shader/types/Types"
import simpleFrag from '../../assets/shaders/Simple.frag?raw'
import simpleVert from '../../assets/shaders/Simple.vert?raw'
import basicFrag from '../../assets/shaders/Basic.frag?raw'
import basicVert from '../../assets/shaders/Basic.vert?raw'
import defaultFrag from '../../assets/shaders/Default.frag?raw'
import defaultVert from '../../assets/shaders/Default.vert?raw'

export function configureShaders(game: Game): void
{
    const shaderLibrary = game.GetLibrary(Shader)

    shaderLibrary.Add(
        'Simple',
        new Shader(
          {
            vertexSrc: simpleVert,
            fragmentSrc: simpleFrag,
                
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920,
                attributes:
                [
                    new Attribute(
                        ShaderVec3, 'A_Position',
                        (entity: Entity) => {
                            const mesh = entity.GetComponent(Mesh)!
                            return (mesh as DynamicMesh).PositionBuffer!
                        }
                    ),
                ],
                uniforms:
                [
                    new Uniform(
                        ShaderVec4, 'colour',
                        (entity: Entity) => entity.GetComponent(Material)!.Diffuse
                    )
                ]
            }
        )
    )

    shaderLibrary.Add(
        'Basic',
        new Shader(
          {
            vertexSrc: basicVert,
            fragmentSrc: basicFrag,
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920,
                attributes:
                [
                    // new Attribute(
                    //     ShaderVec3, 'A_Position',
                    //     (entity: Entity) => entity.GetComponent(Mesh)!.PositionBuffer!
                    // ),
                    new Attribute(
                        ShaderVec4, 'A_Colour',
                        (entity: Entity) => {
                            const mesh = entity.GetComponent(Mesh)!
                            return (mesh as DynamicMesh).ColourBuffer!
                        }
                    ),
                ],
                uniforms:
                [
                ]
            }
        )
    )

    shaderLibrary.Add(
        'Default',
        new Shader(
          {
            vertexSrc: defaultVert,
            fragmentSrc: defaultFrag,
                baseColour: new Colour4(0, 0, 0, 1),
                height: 1080,
                width: 1920,
                attributes:
                [
                    new Attribute(
                        ShaderVec3, 'A_Position',
                        (entity: Entity) => entity.GetComponent(Mesh)!.PositionBuffer!
                    ),
                    new Attribute(
                        ShaderVec2, 'A_UV',
                        (entity: Entity) => entity.GetComponent(Mesh)!.UVBuffer!
                    ),
                    new Attribute(
                        ShaderVec4, 'A_Colour',
                        (entity: Entity) => entity.GetComponent(Mesh)!.ColourBuffer!
                    ),
                    new Attribute(
                        ShaderVec4, 'A_Normal',
                        (entity: Entity) => entity.GetComponent(Mesh)!.NormalBuffer!
                    ),
                    new Attribute(
                        ShaderVec4, 'A_Normal',
                        (entity: Entity) => entity.GetComponent(Mesh)!.NormalBuffer!
                    ),
                ],
                uniforms:
                [
                    
                    new Uniform(
                        ShaderVec4, 'U_Material.Ambient',
                        (entity: Entity) => entity.GetComponent(Material)!.Ambient
                    ),
                    new Uniform(
                        ShaderVec4, 'U_Material.Diffuse',
                        (entity: Entity) => entity.GetComponent(Material)!.Diffuse
                    ),
                    new Uniform(
                        ShaderVec4, 'U_Material.Specular',
                        (entity: Entity) => entity.GetComponent(Material)!.Specular
                    ),
                    new Uniform(
                        ShaderFloat, 'U_Material.Shininess',
                        (entity: Entity) => entity.GetComponent(Material)!.Shininess
                    ),
                    new Uniform(
                        ShaderFloat, 'U_Material.Alpha',
                        (entity: Entity) => entity.GetComponent(Material)!.Alpha
                    ),
                    new Uniform(
                        ShaderBool, 'U_Material.HasImageMap',
                        (entity: Entity) => entity.GetComponent(Material)!.HasImageMap
                    ),
                    new Uniform(
                        ShaderBool, 'U_Material.HasBumpMap',
                        (entity: Entity) => entity.GetComponent(Material)!.HasImageMap
                    ),
                ]
            }
        )
    )
}
