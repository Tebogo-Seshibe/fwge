import { GL } from "@fwge/common"
import { Class, Component } from "@fwge/core"
import { Mesh } from "../../Mesh"
import { ShaderFieldType, ShaderVec2, ShaderVec3, ShaderVec4 } from "./Types"

export interface IAttribute<T extends Component>
{
    sourceType: Class<ShaderFieldType<any>>
    sourceName: string
    targetType: Class<T>
    targetName: keyof T
}

export class Attributes
{
    layouts: Map<string, ShaderFieldType<any>> = new Map()

    Add<T extends Component>(attribute: IAttribute<T>)
    {
        this.layouts.set(attribute.sourceName, new attribute.sourceType())
        return this
    }
    
    Bind<T extends Component>(obj: T)
    {
        // for (const [, layout] of this.layouts)
        // {
        //     GL.enableVertexAttribArray(layout.Id)
        //     GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
        //     GL.vertexAttribPointer(layout.Id, layout.Size, layout.Type, layout.Normalized, 0, 0)
        //     GL.vertexAttribPointer(attributes.Position, 3, GL.FLOAT, false, 0, 0)
        // }
    }

    Unbind()
    {

    }
}

const myAttributes = new Attributes()

// myAttributes
//     .Add(
//     {
//         sourceType: ShaderVec3,
//         sourceName: 'A_Position',
//         targetType: Mesh,
//         targetName: 'PositionBuffer'
//     })
//     .Add(
//     {
//         sourceType: ShaderVec4,
//         sourceName: 'A_Colour',
//         targetType: Mesh,
//         targetName: 'ColourBuffer'
//     })
//     .Add(
//     {
//         sourceType: ShaderVec3,
//         sourceName: 'A_Normal',
//         targetType: Mesh,
//         targetName: 'NormalBuffer'
//     })
//     .Add(
//     {
//         sourceType: ShaderVec2,
//         sourceName: 'A_UV',
//         targetType: Mesh,
//         targetName: 'UVBuffer'
//     })



    