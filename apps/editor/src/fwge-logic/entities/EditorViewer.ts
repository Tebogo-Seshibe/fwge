import { GL, Matrix3, Matrix4, Vector3 } from "@fwge/common";
import { PerspectiveCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { ButtonState, Input, KeyState, KeyboardState, WheelState } from "@fwge/input";
import { EditorTag } from "../components/EditorTag";

export class EditorViewer extends Entity
{
    private theta: number = 0;
    private phi: number = 15;
    private radius: number = 10;
    
    private readonly target: Vector3 = Vector3.Zero;
    private readonly up: Vector3 = Vector3.Zero;
    private readonly right: Vector3 = Vector3.Zero;
    private readonly forward: Vector3 = Vector3.Zero;
    private readonly movement: Vector3 = Vector3.Zero;
    private readonly rotationMatrix: Matrix3 = Matrix3.Zero;

    private readonly zoomSpeed: number = 50;
    private readonly rotationSpeed: number = 100;
    private readonly panSpeed: number = 1;

    private transform!: Transform;
    private camera!: PerspectiveCamera;

    override Init(): void
    {
        this.AddComponents(
            new EditorTag(),
            new PerspectiveCamera(),
            new Transform(
            {
                position:  new Vector3(0,1,10).Normalize(),
                rotation: [ 0, 0, 0 ],
                scale: [ 1, 1, 1]
            }),
            new Input(
            {
                onInput: (delta, keyboard, mouse, controllers): void =>
                {
                    if (mouse.Wheel !== WheelState.CENTERED)
                    {
                        const scrollAmount = mouse.Wheel === WheelState.UP
                            ? this.zoomSpeed
                            : -this.zoomSpeed;
                        this.Zoom(scrollAmount * delta);
                    }
                    
                    if (mouse.Left === ButtonState.PRESSED)
                    {
                        (GL.canvas as HTMLCanvasElement).style.cursor = 'none';
                        this.Pan(delta, keyboard);
                    }
                    else
                    {
                        (GL.canvas as HTMLCanvasElement).style.cursor = 'default';
                    }
                    
                    if (mouse.Right === ButtonState.PRESSED)
                    {
                        this.Rotate(mouse.Offset.X * delta * this.rotationSpeed, mouse.Offset.Y * delta * this.rotationSpeed);
                    }
                },
            })
        );

        this.transform = this.GetComponent(Transform)!;
        this.camera = this.GetComponent(PerspectiveCamera)!;

        this.Zoom(0)
        this.Rotate(0,0)
    }

    private degrees(radians: number): number
    {
        return radians * 180 / Math.PI;
    }

    private radians(degrees: number): number
    {
        return degrees / 180 * Math.PI;
    }

    private Rotate(deltaTheta: number, deltaPhi: number): void
    {
        // const view = this.transform.Position.Clone();
        // const length = view.Length;
        // const xy = new Vector3(view.X, view.Y, 0).Normalize();
        // const xz = new Vector3(view.X, 0, view.Z).Normalize();
        // const yz = new Vector3(0, view.Y, view.Z).Normalize();

        // const theta = this.degrees(xz.Dot(Vector3.UnitX));
        // const phi = this.degrees(yz.Dot(Vector3.UnitZ));
        
        // this.transform.RotateAround(this.parent.transform, [0,1,0], this.orbit * delta * 10)
        // const matX = Matrix3.RotationMatrixAroundAxis(this.target.X, 0, 0, theta);
        // const matY = Matrix3.RotationMatrixAroundAxis(0, this.target.Y, 0, this.transform.Rotation.Y)
        // const mat = Matrix3.Multiply(matX, matY);
        // Matrix3.MultiplyVector(mat, this.transform.Position, this.transform.Position)
        // this.transform.Position.Set(
        //     length * Math.sin(theta) * Math.cos(phi),
        //     length * Math.sin(phi) * Math.sin(theta),
        //     length * Math.cos(theta)
        // )
        // this.transform.Rotation.Set(phi, theta, 0);

        this.RotateAroundAxis(
            0, this.target.Y, 0,
            deltaTheta
        )
        
    }

    private Zoom(delta: number): void
    {
        this.camera.FieldOfView -= delta;
    }

    private Pan(delta: number, keyboard: KeyboardState): void
    {
        const wPressed = keyboard.KeyW !== KeyState.RELEASED && keyboard.KeyW !== KeyState.UP;
        const aPressed = keyboard.KeyA !== KeyState.RELEASED && keyboard.KeyA !== KeyState.UP;
        const sPressed = keyboard.KeyS !== KeyState.RELEASED && keyboard.KeyS !== KeyState.UP;
        const dPressed = keyboard.KeyD !== KeyState.RELEASED && keyboard.KeyD !== KeyState.UP;
        const qPressed = keyboard.KeyQ !== KeyState.RELEASED && keyboard.KeyQ !== KeyState.UP;
        const ePressed = keyboard.KeyE !== KeyState.RELEASED && keyboard.KeyE !== KeyState.UP;
        const shiftPressed = keyboard.KeyShift !== KeyState.RELEASED && keyboard.KeyShift !== KeyState.UP;
        const movementSpeed = this.panSpeed * (shiftPressed ? 2 : 1);

        this.rotationMatrix.Set(Matrix4.RotationMatrix(this.transform.Rotation).Matrix3);
        Matrix3.MultiplyVector(this.rotationMatrix, 0, 0, -1, this.forward);
        Matrix3.MultiplyVector(this.rotationMatrix, 1, 0, 0, this.right);

        if ((wPressed && sPressed) || (!wPressed && !sPressed))
        {
            this.forward.Set(0, 0, 0);
        }
        else if (!wPressed && sPressed)
        {
            this.forward.Negate();
        }

        if ((dPressed && aPressed) || (!dPressed && !aPressed))
        {
            this.right.Set(0, 0, 0);
        }
        else if (!dPressed && aPressed)
        {
            this.right.Negate();
        }

        this.up.Set(0, movementSpeed * delta, 0);

        if ((qPressed && ePressed) || (!qPressed && !ePressed))
        {
            this.up.Set(0, 0, 0);
        }
        else if (!qPressed && ePressed)
        {
            this.up.Negate();
        }

        Vector3.Add(this.forward, this.right, this.movement);
        if (this.movement.Length !== 0)
        {
            this.movement.Scale(movementSpeed * delta / this.movement.Length);
        }

        this.transform.Position.Add(this.movement).Add(this.up);
    }

    private RotateAroundAxis(xyz: number, angle: number): void
    private RotateAroundAxis(x: number, y: number, z: number, angle: number): void
    private RotateAroundAxis(array: [number, number, number], angle: number): void
    private RotateAroundAxis(vector: Vector3, angle: number): void
    private RotateAroundAxis(_0: Vector3 | [number, number, number] | number, _1: number, _2?: number, _3?: number): void
    {
        let mat: Matrix3
        if (typeof _0 === 'number')
        {
            if (_2 === undefined || _3 === undefined)
            {
                mat = Matrix3.RotationMatrixAroundAxis(_0, _0, _0, _1)
            }
            else
            {
                mat = Matrix3.RotationMatrixAroundAxis(_0, _1, _2 as number, _3 as number)
            }
        }
        else 
        {
            mat = Matrix3.RotationMatrixAroundAxis(_0 as [number, number, number], _1)
        }
        Matrix3.MultiplyVector(mat, this.transform.Position, this.transform.Position)
    }

}