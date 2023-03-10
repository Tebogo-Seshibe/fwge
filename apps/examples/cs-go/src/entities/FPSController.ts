import { clamp, Matrix3, Matrix4, Vector2, Vector3 } from "@fwge/common";
import { PerspectiveCamera, Transform } from "@fwge/core";
import { ControllerState, IInputArgs, KeyboardState, KeyState, MouseState } from "@fwge/input";
import { Collider, CubeCollider, RigidBody } from "@fwge/physics";
import { GameObject } from "./GameObject";

export class FPSController extends GameObject
{
    readonly camera: PerspectiveCamera = new PerspectiveCamera({ fieldOfView: 45, farClipping: 1000 });
    readonly cameraTransform: Transform = new Transform({ position: [0, 0, 0] });

    readonly up: Vector3 = Vector3.Zero;
    readonly right: Vector3 = Vector3.Zero;
    readonly forward: Vector3 = Vector3.Zero;
    readonly movement: Vector3 = Vector3.Zero;
    readonly rotationDelta: Vector2 = Vector2.Zero;
    readonly rotationMatrix: Matrix3 = Matrix3.Identity;

    readonly movementSpeed: number = 15;
    readonly turnSpeed: number = 25;
    readonly jumpHeight: number = 15;
    canJump: boolean = true;

    rigidbody!: RigidBody;
    collider!: Collider;

    override OnCreate(): void
    {
        this.transform.Position.Set(0, 1.5, 15);
        this.rigidbody = new RigidBody({ mass: 5 });
        this.collider = new CubeCollider();

        this.AddComponent(this.collider);
        this.AddComponent(this.rigidbody);
        this.AddChild(
            this.Scene
                .CreateEntity()
                .AddComponent(this.cameraTransform)
                .AddComponent(this.camera)
        );

        this.Scene.Windows.first.Camera = this.camera;
    }

    override OnInput({ Keyboard, Controllers, Mouse }: IInputArgs, delta: number): void
    {
        const controller = Controllers.first;
        if (controller)
        {
            this.handleControllerMovement(controller, delta);
        }
        else
        {
            this.handleKeyboardMovement(Keyboard, Mouse, delta);
        }
    }

    private handleControllerMovement(controller: ControllerState, delta: number)
    {
        const movementSpeed = this.movementSpeed * (controller.LeftStickButton ? 2 : 1);
        const deadzone = 0.25;
        const turn = controller.RightStick.YX;
        if (Math.abs(turn.X) < deadzone)
        {
            turn.X = 0;
        }
        if (Math.abs(turn.Y) < deadzone)
        {
            turn.Y = 0;
        }

        Vector2.Scale(turn, this.turnSpeed * delta * 10, this.rotationDelta);
        this.transform.Rotation.Y += this.rotationDelta.Y;
        this.cameraTransform.Rotation.X = clamp(this.cameraTransform.Rotation.X - this.rotationDelta.X, -80, 80);

        this.rotationMatrix.Set(Matrix4.RotationMatrix(this.transform.Rotation).Matrix3);
        Matrix3.MultiplyVector(this.rotationMatrix, 0, 0, -1, this.forward);
        Matrix3.MultiplyVector(this.rotationMatrix, 1, 0, 0, this.right);

        if (Math.abs(controller.LeftStick.Y) < deadzone)
        {
            this.forward.Set(0, 0, 0);
        }
        else if (controller.LeftStick.Y < -deadzone)
        {
            this.forward.Negate();
        }

        if (Math.abs(controller.LeftStick.X) < deadzone)
        {
            this.right.Set(0, 0, 0);
        }
        else if (controller.LeftStick.X < -deadzone)
        {
            this.right.Negate();
        }

        Vector3.Add(this.forward, this.right, this.movement);
        if (this.movement.Length !== 0)
        {
            this.movement.Scale(movementSpeed * delta / this.movement.Length);
        }

        this.transform.Position.Add(this.movement).Add(this.up);
    }

    private handleKeyboardMovement(Keyboard: KeyboardState, Mouse: MouseState, delta: number)
    {
        const wPressed = Keyboard.KeyW !== KeyState.RELEASED && Keyboard.KeyW !== KeyState.UP;
        const aPressed = Keyboard.KeyA !== KeyState.RELEASED && Keyboard.KeyA !== KeyState.UP;
        const sPressed = Keyboard.KeyS !== KeyState.RELEASED && Keyboard.KeyS !== KeyState.UP;
        const dPressed = Keyboard.KeyD !== KeyState.RELEASED && Keyboard.KeyD !== KeyState.UP;
        const qPressed = Keyboard.KeyQ !== KeyState.RELEASED && Keyboard.KeyQ !== KeyState.UP;
        const ePressed = Keyboard.KeyE !== KeyState.RELEASED && Keyboard.KeyE !== KeyState.UP;
        const shiftPressed = Keyboard.KeyShift !== KeyState.RELEASED && Keyboard.KeyShift !== KeyState.UP;
        const movementSpeed = this.movementSpeed * (shiftPressed ? 2 : 1);

        Vector2.Scale(Mouse.Offset, this.turnSpeed * delta, this.rotationDelta);
        this.transform.Rotation.Y += this.rotationDelta.X;
        this.cameraTransform.Rotation.X = clamp(this.cameraTransform.Rotation.X + this.rotationDelta.Y, -80, 80);

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

        if (this.canJump && Keyboard.KeySpace === KeyState.PRESSED)
        {
            this.canJump = false;
            this.rigidbody.Velocity.Add(0, this.jumpHeight, 0);
        }
        else if (!this.canJump && Keyboard.KeySpace === KeyState.UP)
        {
            this.canJump = true;
        }
    }
}
