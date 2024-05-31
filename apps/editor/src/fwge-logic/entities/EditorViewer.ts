import { GL, Maths, Matrix3, Matrix4, Vector3 } from "@fwge/common";
import { PerspectiveCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { ButtonState, Input, KeyState, KeyboardState, WheelState } from "@fwge/input";
import { EditorTag } from "../components/EditorTag";

export class EditorViewer extends Entity
{
    
    private readonly target: Vector3 = Vector3.Zero;
    private readonly up: Vector3 = Vector3.Zero;
    private readonly right: Vector3 = Vector3.Zero;
    private readonly forward: Vector3 = Vector3.Zero;
    private readonly movement: Vector3 = Vector3.Zero;
    private readonly rotationMatrix: Matrix3 = Matrix3.Zero;

    private readonly zoomSpeed: number = 50;
    private readonly rotationSpeed: number = 50;
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
                position:  new Vector3(0,1,10),
                rotation: [ 0, 0, 0 ],
                scale: [ 1, 1, 1]
            }),
            new Input(
            {
                onInput: (delta, keyboard, mouse): void =>
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
                        (GL.canvas as HTMLCanvasElement).style.cursor = 'none';
                        this.Rotate(
                            mouse.Offset.X * delta * this.rotationSpeed,
                            mouse.Offset.Y * delta * this.rotationSpeed
                        );
                    }
                    else
                    {
                        (GL.canvas as HTMLCanvasElement).style.cursor = 'default';
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
        const rotX = Matrix3.RotationMatrixAroundAxis(0, 1, 0, deltaTheta);
        const rotY = Matrix3.RotationMatrixAroundAxis(1, 0, 0, deltaPhi);
        
        Matrix3.MultiplyVector(rotX, this.transform.Position, this.transform.Position);
        Matrix3.MultiplyVector(rotY, this.transform.Position, this.transform.Position);

        this.transform.Rotation.Set(
            Maths.clamp(this.transform.Rotation.X - deltaPhi, -80, 80),
            this.transform.Rotation.Y - deltaTheta,
            0
        );

        console.log(this.transform.Position.toString(), Vector3.DistanceSquared(this.transform.Position, this.target))
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
        this.target.Add(this.movement).Add(this.up);
    }
}
