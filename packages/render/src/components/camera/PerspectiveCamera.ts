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
    public static Main?: Camera

    get ViewMatrix(): Matrix4
    {
        const transform = this.Owner?.GetComponent(Transform)
        
        return transform 
            ? Matrix4.Inverse(transform.ModelViewMatrix)
            : Matrix4.Identity
    }

    UpdateProjection(): void
    {
        Matrix4.PerspectiveProjection(
            this._nearClipping,
            this._farClipping,
            this._fieldOfView,
            this._aspectRatio,
            this.ProjectionMatrix
        )
    }    
    
    private _fieldOfView: number
    public get FieldOfView(): number
    {
        return this._fieldOfView
    }

    public set FieldOfView(fieldOfView: number)
    {
        this._fieldOfView = fieldOfView
        this.UpdateProjection()
    }
    
    private _aspectRatio: number
    public get AspectRatio(): number
    {
        return this._aspectRatio
    }

    public set AspectRatio(aspectRatio: number)
    {
        this._aspectRatio = aspectRatio
        this.UpdateProjection()
    }
    
    private _nearClipping: number
    public get NearClipping(): number
    {
        return this._nearClipping
    }

    public set NearClipping(nearClipping: number)
    {
        this._nearClipping = nearClipping
        this.UpdateProjection()
    }
    
    private _farClipping: number
    public get FarClipping(): number
    {
        return this._farClipping
    }

    public set FarClipping(farClipping: number)
    {
        this._farClipping = farClipping
        this.UpdateProjection()
    }

    constructor()
    constructor(camera: IPerspectiveCamera)
    constructor(camera: IPerspectiveCamera = { })
    {
        super()

        this._fieldOfView = camera.fieldOfView ?? 50
        this._aspectRatio = camera.aspectRatio ?? 16 / 9
        this._nearClipping = camera.nearClipping ?? 0.1
        this._farClipping = camera.farClipping ?? 900
        this.UpdateProjection()
    }
}
