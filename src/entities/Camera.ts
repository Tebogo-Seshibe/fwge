import { Transform } from '../components'
import { Entity } from '../ecs/Entity'
import { Scene } from '../ecs/Scene'
import { Matrix4 } from '../atoms/matrix/Matrix4'
import { Vector3 } from '../atoms/vector/Vector3'
import { LookAt, Orthographic, Perspective } from '../utils/Projection'
import { Component, Class, Registry } from '../ecs/'

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC,
    LOOKAT
}

export class Camera extends Entity
{
    public get Transform(): Transform
    {
        return this.GetComponent(Transform)!
    }

    private _matrix: Matrix4 = Matrix4.IDENTITY
    public get Matrix(): Matrix4
    {
        return this._matrix.Clone()
    }

    constructor(
        scene: Scene,
        public Mode: ViewMode = ViewMode.PERSPECTIVE,
        
        public FieldOfView: number = 50,
        public AspectRatio: number = 16 / 9,
    
        public NearClipping: number = 0.1,
        public FarClipping: number = 900,
    
        public Left: number = -10,
        public Right: number = 10,
        public Top: number = 10,
        public Bottom: number = -10,
    
        public HorizontalTilt: number = 0,
        public VericalTilt: number = 0,
    
        public Forward: Vector3 = new Vector3(0, 0, -1),
        public Target: Vector3 = new Vector3(0, 0, 0),
        public Up: Vector3 = new Vector3(0, 1, 0)
    ) {
        super(scene)

        this.AddComponent(new Transform())
        
        switch (this.Mode)
        {
            case ViewMode.PERSPECTIVE:
                this._matrix = Perspective(this.NearClipping, this.FarClipping, this.FieldOfView, this.AspectRatio)
                break

            case ViewMode.ORTHOGRAPHIC:
                this._matrix = Orthographic(this.Left, this.Right, this.Top, this.Bottom, this.NearClipping, this.FarClipping, this.HorizontalTilt, this.VericalTilt)
                break

            case ViewMode.LOOKAT:
                this._matrix = LookAt(this.GetComponent(Transform)!.Position, this.Target, this.Up)
                break
        }
    }
    
    public override RemoveComponent<T extends Component>(type: Class<T>): Entity
    {
        if (Registry.getComponentTypeId(type) !== Registry.getComponentTypeId(Transform))
        {
            return super.RemoveComponent(type)
        }

        return this
    }
}
