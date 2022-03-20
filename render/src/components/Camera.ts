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
    get Projection(): Matrix4
    {
        if (this._dirty)
        {
            switch (this._mode)
            {
                case ViewMode.PERSPECTIVE:
                    this._matrix = Perspective(this.NearClipping, this.FarClipping, this.FieldOfView, this.AspectRatio)
                    break
                case ViewMode.ORTHOGRAPHIC:
                    this._matrix = Orthographic(this.Left, this.Right, this.Top, this.Bottom, this.NearClipping, this.FarClipping, this.HorizontalTilt, this.VerticalTilt)
                    break
                case ViewMode.LOOKAT:
                    this._matrix = LookAt(this.Owner!.GetComponent(Transform)!.Position, this.Target, this.Up)
                    break
            }

            this._dirty = false
        }
        
        return this._matrix
    }

    public static Main?: Camera
    private _dirty: boolean = true
    private _matrix: Matrix4 = Matrix4.IDENTITY

    
    private _mode: ViewMode
    get Mode()
    {
        return this._mode
    }
    set Mode(mode: ViewMode)
    {
        this._mode = mode
        this._dirty = true
    }

    private _screenWidth: number
    get ScreenWidth()
    {
        return this._screenWidth
    }
    set ScreenWidth(ScreenWidth: number)
    {
        this._screenWidth = ScreenWidth
        this._dirty = true
    }
    
    private _screenHeight: number
    get ScreenHeight()
    {
        return this._screenHeight
    }
    set ScreenHeight(ScreenHeight: number)
    {
        this._screenHeight = ScreenHeight
        this._dirty = true
    }
    
    private _fieldOfView: number
    get FieldOfView()
    {
        return this._fieldOfView
    }
    set FieldOfView(FieldOfView: number)
    {
        this._fieldOfView = FieldOfView
        this._dirty = true
    }
    
    private _aspectRatio: number
    get AspectRatio()
    {
        return this._aspectRatio
    }
    set AspectRatio(AspectRatio: number)
    {
        this._aspectRatio = AspectRatio
        this._dirty = true
    }
    
    private _nearClipping: number
    get NearClipping()
    {
        return this._nearClipping
    }
    set NearClipping(NearClipping: number)
    {
        this._nearClipping = NearClipping
        this._dirty = true
    }
    
    private _farClipping: number
    get FarClipping()
    {
        return this._farClipping
    }
    set FarClipping(FarClipping: number)
    {
        this._farClipping = FarClipping
        this._dirty = true
    }
    
    private _left: number
    get Left()
    {
        return this._left
    }
    set Left(Left: number)
    {
        this._left = Left
        this._dirty = true
    }
    
    private _right: number
    get Right()
    {
        return this._right
    }
    set Right(Right: number)
    {
        this._right = Right
        this._dirty = true
    }
    
    private _top: number
    get Top()
    {
        return this._top
    }
    set Top(Top: number)
    {
        this._top = Top
        this._dirty = true
    }
    
    private _bottom: number
    get Bottom()
    {
        return this._bottom
    }
    set Bottom(Bottom: number)
    {
        this._bottom = Bottom
        this._dirty = true
    }
    
    private _horizontalTilt: number
    get HorizontalTilt()
    {
        return this._horizontalTilt
    }
    set HorizontalTilt(HorizontalTilt: number)
    {
        this._horizontalTilt = HorizontalTilt
        this._dirty = true
    }
    
    private _verticalTilt: number
    get VerticalTilt()
    {
        return this._verticalTilt
    }
    set VerticalTilt(VerticalTilt: number)
    {
        this._verticalTilt = VerticalTilt
        this._dirty = true
    }
    
    private _forward: Vector3
    get Forward()
    {
        return this._forward
    }
    set Forward(Forward: Vector3)
    {
        this._forward = Forward
    }
    
    private _target: Vector3
    get Target()
    {
        return this._target
    }
    set Target(Target: Vector3)
    {
        this._target = Target
        this._dirty = true
    }
    
    private _up: Vector3
    get Up()
    {
        return this._up
    }
    set Up(Up: Vector3)
    {
        this._up = Up
        this._dirty = true
    }    

    constructor()
    constructor(camera: ICamera)
    constructor(camera: ICamera = { })
    {
        super()

        this._screenWidth = camera.screenWidth ?? 1920
        this._screenHeight = camera.screenHeight ?? 1080
        this._fieldOfView = camera.fieldOfView ?? 50
        this._aspectRatio = camera.aspectRatio ?? 16 / 9
        this._nearClipping = camera.nearClipping ?? 0.1
        this._farClipping = camera.farClipping ?? 900
        this._left = camera.left ?? -10
        this._right = camera.right ?? 10
        this._top = camera.top ?? 10
        this._bottom = camera.bottom ?? -10
        this._horizontalTilt = camera.horizontalTilt ?? 90
        this._verticalTilt = camera.vericalTilt ?? 90
        this._forward = camera.forward ?? new Vector3(0, 0, 1)
        this._target = camera.target ?? new Vector3(0, 0, 0)
        this._up = camera.up ?? new Vector3(0, 1, 0)
        this._mode = camera.mode ?? ViewMode.PERSPECTIVE
    }
}
