import { Transform } from './Transform'
import { Matrix4 } from '../atoms/matrix/Matrix4'
import { Vector3 } from '../atoms/vector/Vector3'
import { Component } from '../ecs'
import { LookAt, Orthographic, Perspective } from '../utils/Projection'

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC,
    LOOKAT
}

interface ICamera
{
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

export class Camera extends Component
{
    #matrix: Matrix4 = Matrix4.IDENTITY
    get Matrix(): Matrix4
    {
        return this.#matrix.Clone()
    }

    Mode: ViewMode
    FieldOfView: number
    AspectRatio: number
    NearClipping: number
    FarClipping: number
    Left: number
    Right: number
    Top: number
    Bottom: number
    HorizontalTilt: number
    VericalTilt: number
    Forward: Vector3
    Target: Vector3
    Up: Vector3

    constructor()
    constructor(camera: ICamera)
    constructor(camera: ICamera = { })
    {
        super()

        this.Mode = camera.mode ?? ViewMode.PERSPECTIVE
        this.FieldOfView = camera.fieldOfView ?? 50
        this.AspectRatio = camera.aspectRatio ?? 16 / 9
        this.NearClipping = camera.nearClipping ?? 0.1
        this.FarClipping = camera.farClipping ?? 900
        this.Left = camera.left ?? -10
        this.Right = camera.right ?? 10
        this.Top = camera.top ?? 10
        this.Bottom = camera.bottom ?? -10
        this.HorizontalTilt = camera.horizontalTilt ?? 0
        this.VericalTilt = camera.vericalTilt ?? 0
        this.Forward = camera.forward ?? new Vector3(0, 0, -1)
        this.Target = camera.target ?? new Vector3(0, 0, 0)
        this.Up = camera.up ?? new Vector3(0, 1, 0)

        switch (this.Mode)
        {
            case ViewMode.PERSPECTIVE:
                this.#matrix = Perspective(this.NearClipping, this.FarClipping, this.FieldOfView, this.AspectRatio)
                break

            case ViewMode.ORTHOGRAPHIC:
                this.#matrix = Orthographic(this.Left, this.Right, this.Top, this.Bottom, this.NearClipping, this.FarClipping, this.HorizontalTilt, this.VericalTilt)
                break

            case ViewMode.LOOKAT:
                if (this.Parent)
                {
                    this.#matrix = LookAt(this.Parent.GetComponent(Transform)!.Position, this.Target, this.Up)
                }
                break
        }
    }
}
