import { Matrix4 } from '@fwge/common'
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

export class OrthographicCamera extends Camera
{    
    Near: number
    Far: number
    Left: number
    Right: number
    Top: number
    Bottom: number
    HorizontalTilt: number
    VerticalTilt: number

    constructor()
    constructor(camera: IOrthographicCamera)
    constructor(camera: IOrthographicCamera = { })
    {
        super()

        this.Near = camera.near ?? 0.1
        this.Far = camera.far ?? 900
        this.Left = camera.left ?? -10
        this.Right = camera.right ?? 10
        this.Top = camera.top ?? 10
        this.Bottom = camera.bottom ?? -10
        this.HorizontalTilt = camera.horizontalTilt ?? 90
        this.VerticalTilt = camera.vericalTilt ?? 90
        this.UpdateProjection()
    }
    
    override UpdateProjection(): void
    {
        Matrix4.OrthographicProjection(
            this.Left, this.Bottom, this.Near,
            this.Right, this.Top, this.Far,
            this.VerticalTilt,
            this.HorizontalTilt, 
            this.ProjectionMatrix
        )
    }
}
