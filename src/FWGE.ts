import { Animation, AnimationFrame } from './Animation/index'
import { Camera } from './Logic/Camera/index'
import { OBJConverter } from './Logic/Converter/index'
import { ButtonState, Input, KeyboardState, WheelState } from './Logic/Input/index'
import { AmbientLight, DirectionalLight, PointLight, ShadowQuality } from './Logic/Light/index'
import LogicEngine from './Logic/LogicEngine'
import { Equations, Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from './Logic/Maths/index'
import { GameObject, Material, Mesh, RigidBody, Transform } from './Logic/Object/index'
import { ArrayUtils, BinaryTree, List, ListUtils, Stack, Time, Tree } from './Logic/Utility/index'
import PhysicsEngine from './Physics/PhysicsEngine'
import { Colour3, Colour4, Shader } from './Render/index'
import RenderEngine from './Render/RenderEngine'
import { CircleCollider, CubeCollider, PhysicsMaterial, SphereCollider, SquareCollider } from './Physics/Collision/index'

let height: number = 1080
let width: number = 1920
let renderUpdate: number = 60
let physicsUpdate: number = 60
let animationFrame: number = -1

interface IFWGE
{
    canvas: HTMLCanvasElement
    render?: number
    physics?: number
    clear?: Colour4 | Colour3 | number[]
    height: number
    width: number
}

export let GL: WebGLRenderingContext = undefined

export default class FWGE
{
    //#region Components
    public readonly Animation: any = Animation
    public readonly AnimationFrame: any = AnimationFrame
    public readonly Camera: any = Camera
    public readonly OBJConverter: OBJConverter = new OBJConverter
    public readonly Input: Input = new Input
    public readonly ButtonState: any = ButtonState
    public readonly KeyboardState: any = KeyboardState
    public readonly WheelState: any = WheelState
    public readonly AmbientLight: any = AmbientLight
    public readonly DirectionalLight: any = DirectionalLight
    public readonly PointLight: any = PointLight
    public readonly ShadowQuality: any = ShadowQuality
    public readonly Equations: any = Equations
    public readonly Matrix2: any = Matrix2
    public readonly Matrix3: any = Matrix3
    public readonly Matrix4: any = Matrix4
    public readonly Vector2: any = Vector2
    public readonly Vector3: any = Vector3
    public readonly Vector4: any = Vector4
    public readonly GameObject: any = GameObject
    public readonly Material: any = Material
    public readonly Mesh: any = Mesh
    public readonly RigidBody: any = RigidBody
    public readonly Transform: any = Transform
    public readonly ArrayUtils: any = ArrayUtils
    public readonly BinaryTree: any = BinaryTree
    public readonly List: any = List
    public readonly ListUtils: any = ListUtils
    public readonly Stack: any = Stack
    public readonly Time: Time = new Time
    public readonly Tree: any = Tree
    public readonly Colour3: any = Colour3
    public readonly Colour4: any = Colour4
    public readonly Shader: any = Shader
    public readonly CircleCollider: any = CircleCollider
    public readonly CubeCollider: any = CubeCollider
    public readonly PhysicsMaterial: any = PhysicsMaterial
    public readonly SphereCollider: any = SphereCollider
    public readonly SquareCollider: any = SquareCollider
    //#endregion

    //#region Engines
    private RenderEngine: RenderEngine = new RenderEngine
    private LogicEngine: LogicEngine = new LogicEngine
    private PhysicsEngine: PhysicsEngine = new PhysicsEngine
    //#endregion
    
    //#region Public Properties
    public get Height(): number
    {
        return height
    }

    public set Height(height: number)
    {
        height = Math.clamp(height, 0, Number.MAX_SAFE_INTEGER)
    }
    
    public get Width(): number
    {
        return width
    }

    public set Width(width: number)
    {
        width = Math.clamp(width, 0, Number.MAX_SAFE_INTEGER)
    }

    public get RenderUpdate(): number
    {
        return renderUpdate
    }

    public set RenderUpdate(renderUpdate: number)
    {
        renderUpdate = Math.clamp(renderUpdate, 0, Number.MAX_SAFE_INTEGER)
        this.Time.Init(renderUpdate, physicsUpdate)
    }

    public get PhysicsUpdate(): number
    {
        return physicsUpdate
    }

    public set PhysicsUpdate(physicsUpdate: number)
    {
        physicsUpdate = Math.clamp(physicsUpdate, 0, Number.MAX_SAFE_INTEGER)
        this.Time.Init(physicsUpdate, physicsUpdate)
    }
     
    public get GL(): WebGLRenderingContext
    {
        return GL
    }
    //#endregion

    //#region Main Methods
    public Init({ canvas, render = 60, physics = 60, clear = [0, 0, 0, 1], height = 1080, width = 1920 }: IFWGE): boolean
    {
        GL = canvas.getContext('webgl') as WebGLRenderingContext
        
        if (GL === undefined || GL === null)
        {
            return false
        }

        GL.clearColor(clear[0], clear[1], clear[2], clear[3])
    
        this.Input.Init(canvas)
        this.Time.Init(render, physics)

        this.Height = canvas.height = height
        this.Width = canvas.width = width
        
        this.LogicEngine.Init()
        this.PhysicsEngine.Init()
        this.RenderEngine.Init(GL)

        return true
    }
    
    public Start(): void
    {
        if (animationFrame !== -1)
        {
            window.cancelAnimationFrame(animationFrame)
        }

        this.LogicEngine.Reset()
        this.PhysicsEngine.Reset()
        this.RenderEngine.Reset()
        
        this.Update()
    }
    
    public Stop(): void
    {
        if (animationFrame !== -1)
        {
            window.cancelAnimationFrame(animationFrame)
        }
    }

    private Update(): void
    {
        animationFrame = window.requestAnimationFrame(() => this.Update())
        

        this.Time.Update()
        this.LogicEngine.Update(this.Time.Render)
        this.PhysicsEngine.Update(this.Time.Physics)
        this.RenderEngine.Update()
    }
    //#endregion
}
