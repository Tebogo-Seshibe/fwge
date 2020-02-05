import Vector3 from '../Maths/Vector3';
import Transform from '../Object/Transform';
import Viewer, { ViewMode } from './Viewer';

export const Cameras: Camera[] = []

export class ICamera
{
    name?: string
    mode?: ViewMode
    position?: Vector3 | number[]
    rotation?: Vector3 | number[]
    target?: Vector3 | number[]
    up?: Vector3 | number[]
}

export default class Camera extends Viewer
{
    public static Main: Camera
    
    public Transform: Transform
    public Position: Vector3
    public Rotation: Vector3
    public Target: Vector3
    public Up: Vector3

    constructor()
    constructor(viewer: ICamera)
    constructor({ name = 'Viewer', mode = ViewMode.PERSPECTIVE, position = [0, 0, 0], rotation = [0, 0, 0], target = [0, 0, -1], up = [0, 1, 0] }: ICamera = new ICamera)
    {
        super(name)

        this.Mode = mode
        this.Target = new Vector3(position as number[])
        this.Rotation = new Vector3(rotation as number[])
        this.Target = new Vector3(target as number[])
        this.Up = new Vector3(up as number[])

        Cameras.push(this)
    }
}
