import { Matrix4 } from '@fwge/common'
import { Camera } from './Camera'
import { Game } from '../../base';

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
    private readonly Data: Float32Array;

    get Near(): number
    {
        return this.Data[0];
    }
    
    set Near(near: number)
    {
        this.Data[0] = near;
        this.UpdateProjection();
    }

    get Far(): number
    {
        return this.Data[1];
    }

    set Far(far: number)
    {
        this.Data[1] = far;
        this.UpdateProjection();
    }

    get Left(): number
    {
        return this.Data[2];
    }
    
    set Left(left: number)
    {
        this.Data[2] = left;
        this.UpdateProjection();
    }

    get Right(): number
    {
        return this.Data[3];
    }

    set Right(right: number)
    {
        this.Data[3] = right;
        this.UpdateProjection();
    }
    
    get Top(): number
    {
        return this.Data[4];
    }

    set Top(top: number)
    {
        this.Data[4] = top;
        this.UpdateProjection();
    }

    get Bottom(): number
    {
        return this.Data[5];
    }

    set Bottom(bottom: number)
    {
        this.Data[5] = bottom;
        this.UpdateProjection();
    }

    get HorizontalTilt(): number
    {
        return this.Data[6];
    }

    set HorizontalTilt(horizontalTilt: number)
    {
        this.Data[6] = horizontalTilt;
        this.UpdateProjection();
    }

    get VerticalTilt(): number
    {
        return this.Data[7];
    }

    set VerticalTilt(verticalTilt: number)
    {
        this.Data[7] = verticalTilt;
        this.UpdateProjection();
    }

    constructor(game: Game)
    constructor(game: Game, camera: IOrthographicCamera)
    constructor(game: Game, camera: IOrthographicCamera = { })
    {
        super(game)

        this.Data = new Float32Array(
        [
            camera.near             ?? 0.1,
            camera.far              ?? 900,
            camera.left             ?? -10,
            camera.right            ?? 10,
            camera.top              ?? 10,
            camera.bottom           ?? -10,
            camera.horizontalTilt   ?? 90,
            camera.vericalTilt      ?? 90,
        ]);
        this.UpdateProjection()
    }
    
    override UpdateProjection(): void
    {
        Matrix4.BasicOrthographicProjection(
            this.Left,
            this.Bottom,
            this.Near,
            this.Right,
            this.Top,
            this.Far,
            // this.VerticalTilt,
            // this.HorizontalTilt, 
            this.ProjectionMatrix
        )
    }
}
