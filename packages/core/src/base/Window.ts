import { Matrix4, Vector2, Vector2Array } from "@fwge/common"
import { Camera, PerspectiveCamera, StaticMesh } from "../components"
import { ColourType, DepthType, RenderTarget } from "./RenderTarget"
import { Shader } from "./Shader"

export interface IWindow
{
    height?: number
    width?: number
    offset?: Vector2 | Vector2Array
    scale?: Vector2 | Vector2Array
    fullscreen?: boolean
    pipeline?: Array<IRenderPipelineStep | RenderPipelineStep>
    camera?: Camera
}

{
    (window as any)['Matrix4'] = Matrix4
}

export class Window
{
    Height: number
    Width: number
    Position: Vector2
    Scale: Vector2
    FullScreen: boolean
    RenderPipeline: RenderPipelineStep[]
    Camera: Camera

    get FinalComposite(): RenderTarget
    {
        return this.RenderPipeline.last().Output
    }

    get TransformationMatrix(): Matrix4
    {
        // return Matrix4.TranslationMatrix(this.Position[0], this.Position[1], 0)
        return Matrix4.RotationMatrix(0,45,0)
        // return Matrix4.TranslationMatrix(this.Position[0], this.Position[1], 0)
        // return Matrix4.Multiply(
        //     Matrix4.ScaleMatrix(1, 1, 1),
        //     Matrix4.TranslationMatrix(this.Position[0], this.Position[1], 0),
        // )
    }

    readonly RenderPipelineMap: Map<string, number> = new Map()
    readonly Panel = new StaticMesh(
    {
        position: [
            [-1, 1, 0],
            [-1,-1, 0],
            [ 1,-1, 0],
            [ 1, 1, 0],
        ],
        index: [
            0, 1, 2,
            0, 2, 3,
        ]
    })

    constructor()
    constructor(window: IWindow)
    constructor(window: IWindow = { })
    {
        this.Height = window.height ?? 1080
        this.Width = window.width ?? 1920
        this.Position = new Vector2(window.offset ?? [0,0])
        this.Scale = new Vector2(window.scale ?? [1,1])
        this.FullScreen = window.fullscreen ?? false
        this.Camera = window.camera ?? new PerspectiveCamera() 

        if (!window.pipeline)
        {
            window.pipeline = [
            {
                name: 'Default',
                output: new RenderTarget(
                { 
                    colour: [ ColourType.RGBA ],
                    depth: DepthType.INT24,
                    height: this.Height,
                    width: this.Width,
                })
            }]
        }

        this.RenderPipeline = window.pipeline!.map(
            (args, index) =>
            {
                if (args instanceof RenderPipelineStep)
                {
                    this.RenderPipelineMap.set(args.Name, index)
                    return args
                }
                else
                {
                    this.RenderPipelineMap.set(args.name, index)
                    return new RenderPipelineStep(args)
                }
            }
        )
    }
}

interface IRenderPipelineStep
{
    name: string
    input?: string[]
    shader?: Shader
    output: RenderTarget
}

export class RenderPipelineStep
{
    Name: string
    Shader?: Shader
    Input: string[]
    Output: RenderTarget
 
    constructor(args: IRenderPipelineStep)
    {
        this.Input = args.input ?? []
        this.Name = args.name
        this.Output = args.output
        this.Shader = args.shader
    }
}
