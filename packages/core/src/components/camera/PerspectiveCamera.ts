import { Matrix4 } from '@fwge/common'
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
    private readonly Data = new Float32Array(4)

    get FieldOfView(): number
    {
        return this.Data[0]
    }
    set FieldOfView(fieldOfView: number)
    {
        this.Data[0] = fieldOfView
        this.UpdateProjection()
    }

    get AspectRatio(): number
    {
        return this.Data[1]
    }
    set AspectRatio(aspectRatio: number)
    {
        this.Data[1] = aspectRatio
        this.UpdateProjection()
    }

    get NearClipping(): number
    {
        return this.Data[2]
    }
    set NearClipping(nearClipping: number)
    {
        this.Data[2] = nearClipping
        this.UpdateProjection()
    }

    get FarClipping(): number
    {
        return this.Data[3]
    }
    set FarClipping(farClipping: number)
    {
        this.Data[3] = farClipping
        this.UpdateProjection()
    }


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
        Matrix4.PerspectiveProjectionMatrix(
            this.NearClipping,
            this.FarClipping,
            this.FieldOfView,
            this.AspectRatio,
            this.ProjectionMatrix
        )
    }
}
