import { Matrix4 } from '@fwge/common'
import { Transform } from '@fwge/core'
import { Camera } from './Camera'

export interface IPerspectiveCamera
{
    fieldOfView?: number
    aspectRatio?: number
    nearClipping?: number
    farClipping?: number
}

export class PerspectiveCamera extends Camera
{
    FieldOfView: number
    AspectRatio: number
    NearClipping: number
    FarClipping: number

    constructor()
    constructor(camera: IPerspectiveCamera)
    constructor(camera: IPerspectiveCamera = { })
    {
        super()

        this.FieldOfView = camera.fieldOfView ?? 50
        this.AspectRatio = camera.aspectRatio ?? 16 / 9
        this.NearClipping = camera.nearClipping ?? 0.1
        this.FarClipping = camera.farClipping ?? 900
        this.UpdateProjection()
    }
    
    override UpdateProjection(): void
    {
        Matrix4.PerspectiveProjection(
            this.NearClipping,
            this.FarClipping,
            this.FieldOfView,
            this.AspectRatio,
            this.ProjectionMatrix
        )
    }
}
