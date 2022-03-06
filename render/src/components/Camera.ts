import { Matrix4, Vector3 } from '@fwge/common'
import { UniqueComponent, Transform } from '@fwge/core'
import { LookAt, Orthographic, Perspective } from '../utils/Projection'

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC,
    LOOKAT
}

interface ICamera
{
    screenWidth?: number
    screenHeight?: number
    mode?: ViewMode
    fieldOfView?: number
    aspectRatio?: number
    nearClipping?: number
    farClipping?: number
    left?: number
    right?: number
    top?: number
    bottom?: number
    horizontalTilt?: number
    vericalTilt?: number
    forward?: Vector3
    target?: Vector3
    up?: Vector3
    transform?: Transform
}

export class Camera extends UniqueComponent
{
    static Main?: Camera

    #mode?: ViewMode
    #matrix: Matrix4 = Matrix4.IDENTITY
    get Matrix(): Matrix4
    {
        switch (this.#mode)
        {
            case ViewMode.PERSPECTIVE:
                this.#matrix = Perspective(this.NearClipping, this.FarClipping, this.FieldOfView, this.AspectRatio)
                break

            case ViewMode.ORTHOGRAPHIC:
                this.#matrix = Orthographic(this.Left, this.Right, this.Top, this.Bottom, this.NearClipping, this.FarClipping, this.HorizontalTilt, this.VerticalTilt)
                break

            case ViewMode.LOOKAT:
                if (this.Parents?.length === 1)
                {
                    this.#matrix = LookAt(this.Parents[0].GetComponent(Transform)!.Position, this.Target, this.Up)
                }
                break
        }
        
        return this.#matrix.Clone()
    }

    ScreenWidth: number
    ScreenHeight: number
    get Mode()
    {
        return this.#mode!
    }

    set Mode(mode: ViewMode)
    {
        this.#mode = mode
    }

    FieldOfView: number
    AspectRatio: number
    NearClipping: number
    FarClipping: number
    Left: number
    Right: number
    Top: number
    Bottom: number
    HorizontalTilt: number
    VerticalTilt: number
    Forward: Vector3
    Target: Vector3
    Up: Vector3

    constructor()
    constructor(camera: ICamera)
    constructor(camera: ICamera = { })
    {
        super()

        this.ScreenWidth = camera.screenWidth ?? 1920
        this.ScreenHeight = camera.screenHeight ?? 1080
        this.FieldOfView = camera.fieldOfView ?? 50
        this.AspectRatio = camera.aspectRatio ?? 16 / 9
        this.NearClipping = camera.nearClipping ?? 0.1
        this.FarClipping = camera.farClipping ?? 900
        this.Left = camera.left ?? -10
        this.Right = camera.right ?? 10
        this.Top = camera.top ?? 10
        this.Bottom = camera.bottom ?? -10
        this.HorizontalTilt = camera.horizontalTilt ?? 90
        this.VerticalTilt = camera.vericalTilt ?? 90
        this.Forward = camera.forward ?? new Vector3(0, 0, -1)
        this.Target = camera.target ?? new Vector3(0, 0, 0)
        this.Up = camera.up ?? new Vector3(0, 1, 0)
        this.Mode = camera.mode ?? ViewMode.PERSPECTIVE
    }
}
