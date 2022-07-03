import { Matrix4, Vector3 } from '@fwge/common'
import { Transform, UniqueComponent } from '@fwge/core'
import { Camera } from './Camera'

export interface IOrthographicCamera
{
    near?: number
    far?: number
    left?: number
    right?: number
    top?: number
    bottom?: number
    horizontalTilt?: number
    vericalTilt?: number
}

export abstract class OrthographicCamera extends Camera
{
    UpdateProjection(): void
    {
        Matrix4.OrthographicProjection(
            this.Left, this.Right,
            this.Top, this.Bottom,
            this.Near, this.Far,
            this.HorizontalTilt, this.VerticalTilt,
            this.ProjectionMatrix
        )
    }
    
    private _near: number
    
    get Near(): number
    {
        return this._near
    }
    
    set Near(near: number)
    {
        this._near = near
        this.UpdateProjection()
    }
    
    private _far: number
    
    get Far(): number
    {
        return this._far
    }
    
    set Far(far: number)
    {
        this._far = far
        this.UpdateProjection()
    }
    
    private _left: number
    
    get Left(): number
    {
        return this._left
    }
    
    set Left(left: number)
    {
        this._left = left
        this.UpdateProjection()
    }
    
    private _right: number
    
    get Right(): number
    {
        return this._right
    }
    
    set Right(right: number)
    {
        this._right = right
        this.UpdateProjection()
    }
    
    private _top: number
    
    get Top(): number
    {
        return this._top
    }
    
    set Top(top: number)
    {
        this._top = top
        this.UpdateProjection()
    }
    
    private _bottom: number
    
    get Bottom(): number
    {
        return this._bottom
    }
    
    set Bottom(bottom: number)
    {
        this._bottom = bottom
        this.UpdateProjection()
    }
    
    private _horizontalTilt: number
    
    get HorizontalTilt(): number
    {
        return this._horizontalTilt
    }
    
    set HorizontalTilt(horizontalTilt: number)
    {
        this._horizontalTilt = horizontalTilt
        this.UpdateProjection()
    }
    
    private _verticalTilt: number
    
    get VerticalTilt(): number
    {
        return this._verticalTilt
    }
    
    set VerticalTilt(verticalTilt: number)
    {
        this._verticalTilt = verticalTilt
        this.UpdateProjection()
    }

    constructor()
    constructor(camera: IOrthographicCamera)
    constructor(camera: IOrthographicCamera = { })
    {
        super()

        this._near = camera.near ?? 0.1
        this._far = camera.far ?? 900
        this._left = camera.left ?? -10
        this._right = camera.right ?? 10
        this._top = camera.top ?? 10
        this._bottom = camera.bottom ?? -10
        this._horizontalTilt = camera.horizontalTilt ?? 90
        this._verticalTilt = camera.vericalTilt ?? 90
        this.UpdateProjection()
    }
}
