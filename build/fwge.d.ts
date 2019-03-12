declare module "FWGE" {
    export class IFWGE {
        canvas: HTMLCanvasElement;
        renderUpdate: number;
        physcisUpdate: number;
        clear: Float32Array | Array<number>;
    }
    export default class FWGE {
        static readonly GL: WebGLRenderingContext;
        static Init({ canvas, renderUpdate, physcisUpdate, clear }: IFWGE): void;
        Start(): void;
        Pause(): void;
        Stop(): void;
    }
}
declare module "Item" {
    export default class Item {
        readonly ID: number;
        Name: string;
        constructor(name?: string);
    }
}
declare module "Interfaces/Destroyable" {
    export default interface Destroyable {
        Destroy(): void;
    }
}
declare module "Utility/List" {
    class ListNode<T> {
        Next: ListNode<T>;
        Previous: ListNode<T>;
        Value: T;
        constructor(value: T, next?: ListNode<T>, previous?: ListNode<T>);
    }
    export default class List<T> implements Iterable<T> {
        [index: number]: T;
        readonly Size: number;
        private head;
        constructor(size?: number, buffer?: List<T> | Array<T>);
        readonly Length: number;
        Add(value: ListNode<T> | T, index?: number): boolean;
        AddMany(...values: ListNode<T>[] | T[]): void;
        AddAll(values: List<T> | Array<T>): void;
        Get(index: number): ListNode<T>;
        Find(value: T): ListNode<T>;
        IndexOf(value: T): number;
        Remove(value: T | number): T;
        ToArray(): Array<T>;
        [Symbol.iterator](): IterableIterator<T>;
    }
}
declare module "Interfaces/Cloneable" {
    export default interface Cloneable<T> {
        Clone(): T;
    }
}
declare module "Maths/Maths" {
    export default class Maths {
        static Radian(degree: number): number;
        static Cot(angle: number): number;
        static Clamp(value: number, min: number, max: number): number;
        static CleanFloat(value: number): number;
        static IsPowerOf2(value: number): boolean;
    }
}
declare module "Maths/Vector2" {
    import Cloneable from "Interfaces/Cloneable";
    export default class Vector2 extends Float32Array implements Cloneable<Vector2> {
        constructor(x?: Vector2 | Float32Array | number[] | number, y?: number);
        X: number;
        Y: number;
        static readonly ZERO: Vector2;
        static readonly ONE: Vector2;
        static readonly UNIT: Vector2;
        readonly Length: number;
        static Length(x?: Vector2 | Float32Array | number[] | number, y?: number): number;
        Set(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        static Set(vector: Vector2, x: Vector2 | Float32Array | number[] | number | undefined, y?: number): Vector2;
        Sum(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        static Sum(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        Diff(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        static Diff(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        Mult(x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        static Mult(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): Vector2;
        Scale(scalar: number): Vector2;
        static Scale(vector: Vector2, scalar: number): Vector2;
        Dot(x?: Vector2 | Float32Array | number[] | number, y?: number): number;
        static Dot(vector: Vector2, x?: Vector2 | Float32Array | number[] | number, y?: number): number;
        Unit(): Vector2;
        static Unit(vector: Vector2): Vector2;
        toString(): string;
        toLocaleString(): string;
        Clone(): Vector2;
    }
}
declare module "Maths/Vector3" {
    import Cloneable from "Interfaces/Cloneable";
    export default class Vector3 extends Float32Array implements Cloneable<Vector3> {
        constructor(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number);
        X: number;
        Y: number;
        Z: number;
        static readonly ZERO: Vector3;
        static readonly ONE: Vector3;
        static readonly UNIT: Vector3;
        readonly Length: number;
        static Length(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): number;
        Set(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3;
        static Set(vector: Vector3, x: Float32Array | number[] | number, y: number, z: number): Vector3;
        Sum(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3;
        static Sum(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3;
        Diff(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3;
        static Diff(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3;
        Mult(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3;
        static Mult(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3;
        Scale(scalar: number): Vector3;
        static Scale(vector: Vector3, scalar: number): Vector3;
        Dot(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): number;
        static Dot(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): number;
        Cross(x?: Vector3 | Float32Array | number[] | number, y?: number, z?: number): Vector3;
        static Cross(vector: Vector3, x?: Float32Array | number[] | number, y?: number, z?: number): Vector3;
        Unit(): Vector3;
        static Unit(vector: Vector3): Vector3;
        toString(): string;
        toLocaleString(): string;
        Clone(): Vector3;
    }
}
declare module "Maths/Vector4" {
    import Cloneable from "Interfaces/Cloneable";
    import List from "Utility/List";
    import Vector2 from "Maths/Vector2";
    import Vector3 from "Maths/Vector3";
    export default class Vector4 extends Float32Array implements Cloneable<Vector4> {
        constructor();
        constructor(vector: Vector2);
        constructor(vector?: Vector3);
        constructor(vector?: Vector4);
        constructor(array: Float32Array);
        constructor(array: Array<number>);
        constructor(list: List<number>);
        constructor(w: number, x: number, y: number, z: number);
        W: number;
        X: number;
        Y: number;
        Z: number;
        readonly Length: number;
        static Length(w?: Vector4 | Float32Array | Array<number> | List<number> | number, x?: number, y?: number, z?: number): number;
        readonly ZERO: Vector4;
        readonly ONE: Vector4;
        readonly UNIT: Vector4;
        Set(vector: Vector2): Vector4;
        Set(vector?: Vector3): Vector4;
        Set(vector?: Vector4): Vector4;
        Set(array: Float32Array): Vector4;
        Set(array: Array<number>): Vector4;
        Set(list: List<number>): Vector4;
        Set(w: number, x: number, y: number, z: number): Vector4;
        static Set(vector: Vector4, w: Vector2 | Vector3 | Vector4 | Float32Array | Array<number> | List<number> | number, x?: number, y?: number, z?: number): Vector4;
        Sum(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4;
        static Sum(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4;
        Diff(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4;
        static Diff(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4;
        Mult(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4;
        static Mult(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): Vector4;
        static Scale(vector: Vector4, scaler: number): Vector4;
        Dot(w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): number;
        static Dot(vector: Vector4, w?: Vector4 | Float32Array | number[] | number, x?: number, y?: number, z?: number): number;
        Unit(): Vector4;
        static Unit(vector: Vector4): Vector4;
        toString(): string;
        toLocaleString(): string;
        Clone(): Vector4;
    }
}
declare module "Utility/ArrayUtils" {
    import Vector2 from "Maths/Vector2";
    import Vector3 from "Maths/Vector3";
    import Vector4 from "Maths/Vector4";
    export default class ArrayUtiils {
        static FlattenVector(list: Array<Vector2>): Array<number>;
        static FlattenVector(list: Array<Vector3>): Array<number>;
        static FlattenVector(list: Array<Vector4>): Array<number>;
    }
}
declare module "Utility/ListUtils" {
    import List from "Utility/List";
    import Vector2 from "Maths/Vector2";
    import Vector3 from "Maths/Vector3";
    import Vector4 from "Maths/Vector4";
    export default class ListUtiils {
        static FlattenVector(list: List<Vector2>): List<number>;
        static FlattenVector(list: List<Vector3>): List<number>;
        static FlattenVector(list: List<Vector4>): List<number>;
    }
}
declare module "Render/Mesh" {
    import Item from "Item";
    import List from "Utility/List";
    import Vector2 from "Maths/Vector2";
    import Vector3 from "Maths/Vector3";
    import Vector4 from "Maths/Vector4";
    export class BufferType {
        static INDEX: number;
        static POSITION: number;
    }
    export class IMesh {
        name?: string;
        position?: Array<Vector3> | List<Vector3> | Float32Array | Array<number> | List<number>;
        uv?: Array<Vector2> | List<Vector2> | Float32Array | Array<number> | List<number>;
        colour?: Array<Vector4> | List<Vector4> | Float32Array | Array<number> | List<number>;
        normal?: Array<Vector3> | List<Vector3> | Float32Array | Array<number> | List<number>;
        index?: Uint8Array | Array<number> | List<number>;
        wireframe?: Uint8Array | Array<number> | List<number>;
    }
    export default class Mesh extends Item {
        PositionBuffer: WebGLBuffer;
        UVBuffer: WebGLBuffer;
        ColourBuffer: WebGLBuffer;
        NormalBuffer: WebGLBuffer;
        IndexBuffer: WebGLBuffer;
        WireframeBuffer: WebGLBuffer;
        VertexCount: number;
        constructor({ name, position, uv, colour, normal, index, wireframe }?: IMesh);
        Bind(gl: WebGLRenderingContext, type: number, data?: Array<Vector2> | List<Vector2> | Float32Array | Array<number> | List<number>): WebGLBuffer;
        Bind(gl: WebGLRenderingContext, type: number, data?: Array<Vector3> | List<Vector3> | Float32Array | Array<number> | List<number>): WebGLBuffer;
        Bind(gl: WebGLRenderingContext, type: number, data?: Array<Vector4> | List<Vector4> | Float32Array | Array<number> | List<number>): WebGLBuffer;
        Bind(gl: WebGLRenderingContext, type: number, data?: Uint8Array | Array<number> | List<number>): WebGLBuffer;
        Bind(gl: WebGLRenderingContext, type: number, data?: Array<number> | List<number>): WebGLBuffer;
        Unbind(gl: WebGLRenderingContext, buffer: WebGLBuffer): void;
    }
}
declare module "Physics/PhysicsMaterial" {
    import Item from "Item";
    export class IPhysicsMaterial {
        name?: string;
    }
    export default class PhysicsMaterial extends Item {
        constructor({ name }?: IPhysicsMaterial);
    }
}
declare module "Render/Colour4" {
    export default class Colour4 extends Float32Array {
        R: number;
        G: number;
        B: number;
        A: number;
        readonly BIN: string;
        readonly OCT: string;
        readonly HEX: string;
        constructor();
        constructor(hex: string);
        constructor(colour: Colour4 | Float32Array | number[]);
        constructor(r: number, g: number, b: number, a: number);
        Set(r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4;
        static Set(colour: Colour4, r?: Colour4 | Float32Array | number[] | number | string, g?: number, b?: number, a?: number): Colour4;
        static FromBin(bin: string): Colour4;
        static ToBin(bin: Colour4 | Float32Array | Array<number>): string;
        static FromOct(oct: string): Colour4;
        static ToOct(oct: Colour4 | Float32Array | Array<number>): string;
        static FromHex(hex: string): Colour4;
        static ToHex(hex: Colour4 | Float32Array | Array<number>): string;
    }
}
declare module "Shader/ShaderAttributes" {
    export default class ShaderAttributes {
        readonly Position: number;
        readonly Colour: number;
        readonly UV: number;
        readonly Normal: number;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/MaterialUniforms" {
    export default class MaterialUniforms {
        readonly Ambient: WebGLUniformLocation;
        readonly Diffuse: WebGLUniformLocation;
        readonly Specular: WebGLUniformLocation;
        readonly Shininess: WebGLUniformLocation;
        readonly Alpha: WebGLUniformLocation;
        readonly HasImage: WebGLUniformLocation;
        readonly HasBump: WebGLUniformLocation;
        readonly HasSpecular: WebGLUniformLocation;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/MatrixUniforms" {
    export default class MatrixUniforms {
        readonly ModelView: WebGLUniformLocation;
        readonly Projection: WebGLUniformLocation;
        readonly Normal: WebGLUniformLocation;
        readonly Camera: WebGLUniformLocation;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/AmbientUniforms" {
    export default class AmbientUniforms {
        readonly Colour: WebGLUniformLocation;
        readonly Intensity: WebGLUniformLocation;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/DirectionalUniforms" {
    export default class DirectionalUniforms {
        readonly Colour: WebGLUniformLocation;
        readonly Intensity: WebGLUniformLocation;
        readonly Direction: WebGLUniformLocation;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/PointUniform" {
    export default class PointUniform {
        readonly Colour: WebGLUniformLocation;
        readonly Intensity: WebGLUniformLocation;
        readonly Position: WebGLUniformLocation;
        readonly Radius: WebGLUniformLocation;
        readonly Angle: WebGLUniformLocation;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram, index: number);
    }
}
declare module "Shader/LightUniforms" {
    import AmbientUniforms from "Shader/AmbientUniforms";
    import DirectionalUniforms from "Shader/DirectionalUniforms";
    import PointUniform from "Shader/PointUniform";
    export default class LightUniforms {
        private static readonly MAX_LIGHT;
        readonly Ambient: AmbientUniforms;
        readonly Directional: DirectionalUniforms;
        readonly PointCount: WebGLUniformLocation;
        readonly Point: PointUniform[];
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/SamplerUniforms" {
    export default class SamplerUniforms {
        readonly Image: WebGLUniformLocation;
        readonly Bump: WebGLUniformLocation;
        readonly Specular: WebGLUniformLocation;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/ShaderUniforms" {
    import MaterialUniforms from "Shader/MaterialUniforms";
    import MatrixUniforms from "Shader/MatrixUniforms";
    import LightUniforms from "Shader/LightUniforms";
    import SamplerUniforms from "Shader/SamplerUniforms";
    export default class ShaderUniforms {
        readonly Material: MaterialUniforms;
        readonly Matrix: MatrixUniforms;
        readonly Light: LightUniforms;
        readonly Sampler: SamplerUniforms;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module "Shader/Shader" {
    import Item from "Item";
    import ShaderAttributes from "Shader/ShaderAttributes";
    import ShaderUniforms from "Shader/ShaderUniforms";
    class IShader {
        name: string;
        height: number;
        width: number;
        vertexshader: string;
        fragmentshader: string;
        gl: WebGLRenderingContext;
    }
    export let Shaders: Shader[];
    export default class Shader extends Item {
        readonly Attributes: ShaderAttributes;
        readonly Uniforms: ShaderUniforms;
        Program: WebGLProgram;
        Texture: WebGLTexture;
        FrameBuffer: WebGLBuffer;
        RenderBuffer: WebGLBuffer;
        Height: number;
        Width: number;
        constructor({ name, height, width, vertexshader, fragmentshader, gl }: IShader);
        static Init(shader: Shader, gl: WebGLRenderingContext, vertexshader: string, fragmentshader: string): void;
    }
}
declare module "Render/RenderMaterial" {
    import Colour4 from "Render/Colour4";
    import Item from "Item";
    import Shader from "Shader/Shader";
    export class IRenderMaterial {
        name?: string;
        ambient?: Colour4 | Array<number>;
        diffuse?: Colour4 | Array<number>;
        specular?: Colour4 | Array<number>;
        alpha?: number;
        shininess?: number;
        shader?: Shader;
        texture?: any;
    }
    export default class RenderMaterial extends Item {
        Ambient: Colour4;
        Diffuse: Colour4;
        Specular: Colour4;
        Alpha: number;
        Shininess: number;
        ImageMap: WebGLTexture;
        BumpMap: WebGLTexture;
        SpecularMap: WebGLTexture;
        Shader: Shader;
        constructor({ name, ambient, diffuse, specular, alpha, shininess, shader, texture }?: IRenderMaterial);
        AttachShader(shader: Shader): void;
        static BindMap(): void;
        static ApplyImage(src: string, material: RenderMaterial, type: string): void;
        SetTextures({ imagemap, bumpmap, specularmap }?: {
            imagemap?: string;
            bumpmap?: string;
            specularmap?: string;
        }): void;
    }
}
declare module "Transform" {
    import Vector3 from "Maths/Vector3";
    class ITransform {
        position?: Vector3 | Float32Array | number[];
        rotation?: Vector3 | Float32Array | number[];
        scale?: Vector3 | Float32Array | number[];
        shear?: Vector3 | Float32Array | number[];
    }
    export default class Transform {
        Position: Vector3;
        Rotation: Vector3;
        Scale: Vector3;
        Shear: Vector3;
        constructor({ position, rotation, scale, shear }?: ITransform);
        readonly UP: Vector3;
        readonly FORWARD: Vector3;
        readonly RIGHT: Vector3;
    }
}
declare module "GameObject" {
    import GameItem from "GameItem";
    import Item from "Item";
    import List from "Utility/List";
    import Mesh from "Render/Mesh";
    import PhysicsMaterial from "Physics/PhysicsMaterial";
    import RenderMaterial from "Render/RenderMaterial";
    import Transform from "Transform";
    export class IGameObject {
        name?: string;
        transform?: Transform;
        material?: RenderMaterial;
        mesh?: Mesh;
        physics?: PhysicsMaterial;
        animation?: Animation;
        begin?: Function;
        update?: Function;
        end?: Function;
        children?: List<GameObject>;
    }
    export default class GameObject extends Item {
        Bame: string;
        Transform: Transform;
        Material: RenderMaterial;
        Mesh: Mesh;
        Physics: PhysicsMaterial;
        Animation: Animation;
        Begin: Function;
        Update: Function;
        End: Function;
        Children: List<GameObject>;
        constructor({ name, transform, material, mesh, physics, animation, begin, update, end, children }?: IGameObject);
        Attach(item: GameItem): void;
        AttachMany(...items: GameItem[]): void;
        Detach(item: GameItem): void;
        DetachMany(...items: GameItem[]): void;
        Clone(): GameObject;
        static Clone(gameObject: GameObject): GameObject;
    }
}
declare module "Interfaces/Updateable" {
    export default interface Updateable {
        Update(): void;
    }
}
declare module "GameItem" {
    import Item from "Item";
    import Destroyable from "Interfaces/Destroyable";
    import GameObject from "GameObject";
    import List from "Utility/List";
    import Updateable from "Interfaces/Updateable";
    export default interface GameItem extends Item, Updateable, Destroyable {
        GameObjects: List<GameObject>;
    }
}
declare module "ParticleSystem" {
    import Item from "Item";
    import Transform from "Transform";
    type Particle = Transform;
    class IParticleSystem {
        name: string;
    }
    export default class ParticleSystem extends Item {
        readonly Particles: Particle[];
        constructor({ name }: IParticleSystem);
    }
}
declare module "Animation/AnimationFrame" {
    import Colour4 from "Render/Colour4";
    import Transform from "Transform";
    export type Frame = Colour4 | Transform;
    export class IAnimationFrame<Frame> {
        before: Frame;
        after: Frame;
        length: number;
    }
    export default class AnimationFrame<Frame> {
        Before: Frame;
        After: Frame;
        Length: number;
        constructor({ before, after, length }: IAnimationFrame<Frame>);
    }
}
declare module "Animation/Animation" {
    import AnimationFrame, { Frame } from "Animation/AnimationFrame";
    import Item from "Item";
    import List from "Utility/List";
    import Mesh from "Render/Mesh";
    import RenderMaterial from "Render/RenderMaterial";
    import Updateable from "Interfaces/Updateable";
    export class IAnimation {
        name: string;
        mesh?: Mesh;
        material?: RenderMaterial;
        frames?: Array<AnimationFrame<Frame>> | List<AnimationFrame<Frame>>;
        length: number;
    }
    export default class Animation extends Item implements Updateable {
        Frames: List<AnimationFrame<Frame>>;
        Mesh: Mesh;
        Material: RenderMaterial;
        Length: number;
        constructor({ name, mesh, material, frames, length }?: IAnimation);
        Add(frame: List<AnimationFrame<Frame>> | Array<AnimationFrame<Frame>> | AnimationFrame<Frame>): void;
        Update(): void;
    }
}
declare module "Camera/Camera" {
    import Item from "Item";
    import Updateable from "Interfaces/Updateable";
    export enum ViewMode {
        PERSPECTIVE = 0,
        ORTHOGRAPHIC = 1
    }
    export class ICamera {
        mode: ViewMode;
        fieldOfView: number;
        aspectRatio: number;
        nearClipping: number;
        farClipping: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        horizontalTilt: number;
        vericalTilt: number;
    }
    export default class Camera extends Item implements Updateable {
        Mode: ViewMode;
        FieldOfView: ViewMode;
        AspectRatio: number;
        NearClipping: number;
        FarClipping: number;
        Left: number;
        Right: number;
        Top: number;
        Bottom: number;
        HorizontalTilt: number;
        VericalTilt: number;
        constructor({ mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt }: ICamera);
        Update(): void;
    }
}
declare module "Maths/Matrix3" {
    import Cloneable from "Interfaces/Cloneable";
    import List from "Utility/List";
    import Matrix2 from "Maths/Matrix2";
    import Matrix4 from "Maths/Matrix4";
    export default class Matrix3 extends Float32Array implements Cloneable<Matrix3> {
        constructor();
        constructor(matrix: Matrix2);
        constructor(matrix: Matrix3);
        constructor(matrix: Matrix4);
        constructor(array: Float32Array);
        constructor(array: Array<number>);
        constructor(list: List<number>);
        constructor(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number);
        M11: number;
        M12: number;
        M13: number;
        M21: number;
        M22: number;
        M23: number;
        M31: number;
        M32: number;
        M33: number;
        static readonly ZERO: Matrix3;
        static readonly IDENTITY: Matrix3;
        Set(matrix: Matrix2): Matrix3;
        Set(matrix: Matrix3): Matrix3;
        Set(matrix: Matrix4): Matrix3;
        Set(array: Float32Array): Matrix3;
        Set(array: Array<number>): Matrix3;
        Set(array: List<number>): Matrix3;
        Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
        static Set(matrix: Matrix3, m11?: Matrix4 | Matrix3 | Matrix2 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3;
        Transpose(): Matrix3;
        static Transpose(matrix: Matrix3): Matrix3;
        readonly Determinant: number;
        static Determinant(m11?: Matrix3 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): number;
        Inverse(): Matrix3;
        static Inverse(matrix: Matrix3): Matrix3;
        Sum(matrix: Matrix3): Matrix3;
        Sum(array: Float32Array): Matrix3;
        Sum(array: Array<number>): Matrix3;
        Sum(m11: number, m12: number, m21: number, m22: number): Matrix3;
        static Sum(matrix: Matrix3, m11: Matrix3 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3;
        Mult(m11: Matrix3): Matrix3;
        Mult(array: Float32Array): Matrix3;
        Mult(array: Array<number>): Matrix3;
        Mult(m11: number, m12: number, m21: number, m22: number): Matrix3;
        static Mult(matrix: Matrix3, m11: Matrix3 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m21?: number, m22?: number, m23?: number, m31?: number, m32?: number, m33?: number): Matrix3;
        Scale(scaler: number): Matrix3;
        static Scale(matrix: Matrix3, scaler: number): Matrix3;
        Identity(): Matrix3;
        static Identity(matrix: Matrix3): Matrix3;
        Clone(): Matrix3;
    }
}
declare module "Maths/Matrix2" {
    import Cloneable from "Interfaces/Cloneable";
    import List from "Utility/List";
    import Matrix3 from "Maths/Matrix3";
    import Matrix4 from "Maths/Matrix4";
    export default class Matrix2 extends Float32Array implements Cloneable<Matrix2> {
        constructor();
        constructor(matrix: Matrix2);
        constructor(matrix: Matrix3);
        constructor(matrix: Matrix4);
        constructor(array: Float32Array);
        constructor(array: Array<number>);
        constructor(list: List<number>);
        constructor(m11: number, m12: number, m21: number, m22: number);
        M11: number;
        M12: number;
        M21: number;
        M22: number;
        static readonly ZERO: Matrix2;
        static readonly IDENTITY: Matrix2;
        Set(matrix: Matrix2): Matrix2;
        Set(matrix: Matrix3): Matrix2;
        Set(matrix: Matrix4): Matrix2;
        Set(array: Float32Array): Matrix2;
        Set(array: Array<number>): Matrix2;
        Set(list: List<number>): Matrix2;
        Set(m11: number, m12: number, m21: number, m22: number): Matrix2;
        static Set(matrix: Matrix2, m11: Matrix2 | Matrix4 | Matrix4 | Float32Array | Array<number> | List<number> | number, m12?: number, m21?: number, m22?: number): Matrix2;
        Transpose(): Matrix2;
        static Transpose(matrix: Matrix2): Matrix2;
        readonly Determinant: number;
        static Determinant(m11: Matrix2 | Float32Array | Array<number> | List<number> | number, m12?: number, m21?: number, m22?: number): number;
        Inverse(): Matrix2;
        static Inverse(matrix: Matrix2): Matrix2;
        Sum(matrix: Matrix2): Matrix2;
        Sum(array: Float32Array): Matrix2;
        Sum(array: Array<number>): Matrix2;
        Sum(list: List<number>): Matrix2;
        Sum(m11: number, m12: number, m21: number, m22: number): Matrix2;
        static Sum(matrix: Matrix2, m11?: Matrix2 | Float32Array | Array<number> | List<number> | number, m12?: number, m21?: number, m22?: number): Matrix2;
        Mult(m11: Matrix2): Matrix2;
        Mult(array: Float32Array): Matrix2;
        Mult(array: Array<number>): Matrix2;
        Mult(list: List<number>): Matrix2;
        Mult(m11: number, m12: number, m21: number, m22: number): Matrix2;
        static Mult(matrix: Matrix2, m11?: Matrix2 | Float32Array | Array<number> | List<number> | number, m12?: number, m21?: number, m22?: number): Matrix2;
        Scale(scaler: number): Matrix2;
        static Scale(matrix: Matrix2, scaler: number): Matrix2;
        Identity(): Matrix2;
        static Identity(matrix: Matrix2): Matrix2;
        Clone(): Matrix2;
    }
}
declare module "Maths/Matrix4" {
    import Cloneable from "Interfaces/Cloneable";
    import List from "Utility/List";
    import Matrix2 from "Maths/Matrix2";
    import Matrix3 from "Maths/Matrix3";
    export default class Matrix4 extends Float32Array implements Cloneable<Matrix4> {
        constructor();
        constructor(matrix: Matrix2);
        constructor(matrix: Matrix3);
        constructor(matrix: Matrix4);
        constructor(array: Float32Array);
        constructor(array: Array<number>);
        constructor(list: List<number>);
        constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number);
        M11: number;
        M12: number;
        M13: number;
        M14: number;
        M21: number;
        M22: number;
        M23: number;
        M24: number;
        M31: number;
        M32: number;
        M33: number;
        M34: number;
        M41: number;
        M42: number;
        M43: number;
        M44: number;
        static readonly ZERO: Matrix4;
        static readonly IDENTITY: Matrix4;
        Set(matrix: Matrix2): Matrix4;
        Set(matrix: Matrix3): Matrix4;
        Set(matrix: Matrix4): Matrix4;
        Set(array: Float32Array): Matrix4;
        Set(array: Array<number>): Matrix4;
        Set(list: List<number>): Matrix4;
        Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
        static Set(matrix: Matrix4, m11: Matrix4 | Matrix3 | Matrix2 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4;
        Transpose(): Matrix4;
        static Transpose(matrix: Matrix4): Matrix4;
        readonly Determinant: number;
        static Determinant(m11: Matrix4 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): number;
        Inverse(): Matrix4;
        static Inverse(matrix: Matrix4): Matrix4;
        Sum(matrix: Matrix4): Matrix4;
        Sum(array: Float32Array): Matrix4;
        Sum(array: Array<number>): Matrix4;
        Sum(list: List<number>): Matrix4;
        Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
        static Sum(matrix: Matrix4, m11: Matrix4 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4;
        Mult(matrix: Matrix4): Matrix4;
        Mult(array: Float32Array): Matrix4;
        Mult(array: Array<number>): Matrix4;
        Mult(list: List<number>): Matrix4;
        Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
        static Mult(matrix: Matrix4, m11: Matrix4 | Float32Array | Array<number> | List<number> | number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): Matrix4;
        Scale(scaler: number): Matrix4;
        static Scale(matrix: Matrix4, scaler: number): Matrix4;
        Identity(): Matrix4;
        static Identity(matrix: Matrix4): Matrix4;
        Clone(): Matrix4;
    }
}
declare module "Camera/Viewer" {
    import Matrix4 from "Maths/Matrix4";
    import Updateable from "Interfaces/Updateable";
    import Vector3 from "Maths/Vector3";
    export class IViewer {
        position: Vector3;
        target: Vector3;
    }
    export default class Viewer implements Updateable {
        Position: Vector3;
        Target: Vector3;
        Up: Vector3;
        protected Matrix: Matrix4;
        constructor({ position, target }?: IViewer);
        Update(): void;
    }
}
declare module "Interfaces/Attachable" {
    export default interface Attachable<T> {
        Attach(t: T): void;
        AttachAll(...t: T[]): void;
        Detach(t: T): void;
        DetachAll(...t: T[]): void;
    }
}
declare module "Light/DirectionalLight" {
    import LightItem, { ILightItem } from "Light/LightItem";
    import Vector3 from "Maths/Vector3";
    export class IDirectionalLight extends ILightItem {
        name: string;
        direction: Vector3 | Float32Array | number[];
    }
    export default class DirectionalLight extends LightItem {
        Direction: Vector3;
        constructor({ name, colour, intensity, direction }?: IDirectionalLight);
    }
}
declare module "Light/PointLight" {
    import LightItem, { ILightItem } from "Light/LightItem";
    import Vector3 from "Maths/Vector3";
    export class IPointLight extends ILightItem {
        name: string;
        position: Vector3 | Float32Array | number[];
        radius: number;
        angle: number;
        shininess: number;
    }
    export default class PointLight extends LightItem {
        Position: Vector3;
        Radius: number;
        Angle: number;
        Shininess: number;
        constructor({ name, position, colour, intensity, radius, angle, shininess }?: IPointLight);
    }
}
declare module "Light/Light" {
    import LightItem from "Light/LightItem";
    import List from "Utility/List";
    export default class Light {
        static AmbientCount: number;
        static DirectionalCount: number;
        static PointCount: number;
        static readonly MAX_AMBIENT: number;
        static readonly MAX_DIRECTIONAL: number;
        static readonly MAX_POINT: number;
        static readonly MAX_LIGHTS: number;
        static Lights: List<LightItem>;
        static Add(light: LightItem): void;
        static Remove(light: LightItem): void;
    }
}
declare module "Light/LightItem" {
    import Colour4 from "Render/Colour4";
    import Item from "Item";
    export class ILightItem {
        name: string;
        colour: Colour4 | Float32Array | number[];
        intensity: number;
    }
    export default class LightItem extends Item {
        Colour: Colour4;
        Intensity: number;
        constructor({ name, colour, intensity }?: ILightItem);
    }
}
declare module "Light/AmbientLight" {
    import LightItem, { ILightItem } from "Light/LightItem";
    class IAmbientLight extends ILightItem {
    }
    export default class AmbientLight extends LightItem {
        constructor({ name, colour, intensity }?: IAmbientLight);
    }
}
declare module "Maths/Quaternion" {
    import List from "Utility/List";
    import Vector4 from "Maths/Vector4";
    export default class Quaternion extends Vector4 {
        constructor(w?: Quaternion | Vector4 | Float32Array | List<number> | Array<number> | number, x?: number, y?: number, z?: number);
    }
}
declare module "Physics/PhysicsBody" {
    import Item from "Item";
    export class IPhysicsBody {
        name: string;
        mass: number;
        lockx: boolean;
        locky: boolean;
        lockz: boolean;
    }
    export default class PhysicsBody extends Item {
        Mass: number;
        LockX: boolean;
        LockY: boolean;
        LockZ: boolean;
        Velocity: number;
        Speed: number;
        constructor({ name, mass, lockx, locky, lockz }?: IPhysicsBody);
    }
}
declare module "Physics/Collision/Collider" {
    import Item from "Item";
    import PhysicsItem from "Physics/PhysicsItem";
    import Vector3 from "Maths/Vector3";
    export class ICollider {
        name: string;
        position: Vector3;
        physicsitem: any;
    }
    export default class Collider extends Item {
        Position: Vector3;
        PhysicsItem: PhysicsItem;
        constructor({ name, position, physicsitem }: ICollider);
    }
}
declare module "Physics/PhysicsItem" {
    import Collider from "Physics/Collision/Collider";
    import Item from "Item";
    import PhysicsBody from "Physics/PhysicsBody";
    import PhysicsMaterial from "Physics/PhysicsMaterial";
    export class IPhysicsItem {
        name?: string;
        body?: PhysicsBody;
        collider?: Collider;
        material?: PhysicsMaterial;
    }
    export default class PhysicsItem extends Item {
        Collider: Collider;
        Material: PhysicsMaterial;
        Body: PhysicsBody;
        constructor({ name, body, collider, material }?: IPhysicsItem);
    }
}
declare module "Physics/Collision/BoxCollider" {
    import Collider, { ICollider } from "Physics/Collision/Collider";
    export class IBoxCollider extends ICollider {
        name: string;
        height: number;
        width: number;
        breadth: number;
    }
    export default class BoxCollider extends Collider {
        Height: number;
        Width: number;
        Breadth: number;
        constructor({ name, physicsitem, position, height, width, breadth }?: IBoxCollider);
    }
}
declare module "Physics/Collision/CollisionEvent" {
    export default class CollisionEvent {
        constructor();
    }
}
declare module "Physics/Collision/SphereCollider" {
    import Collider, { ICollider } from "Physics/Collision/Collider";
    export class ISphereCollider extends ICollider {
        name: string;
        radius: number;
    }
    export default class SphereCollider extends Collider {
        Radius: number;
        constructor({ name, position, radius, physicsitem }?: ISphereCollider);
    }
}
declare module "Render/ModelView" {
    import Matrix4 from "Maths/Matrix4";
    import Transform from "Transform";
    export default class ModelView {
        private static Stack;
        static Push(): void;
        static Peek(): Matrix4;
        static Pop(): Matrix4;
        static Transform(transform: Transform): void;
        private static Translate;
        private static Rotate;
        private static Scale;
        private static Shear;
    }
}
declare module "Render/Projection" {
    import Matrix4 from "Maths/Matrix4";
    export default class Projection {
        static Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): Matrix4;
        static Perspective(field_of_view: number, aspect_ratio: number, near: number, far: number): Matrix4;
    }
}
declare module "Render/Renderer" {
    import GameObject from "GameObject";
    import Matrix3 from "Maths/Matrix3";
    export default class Renderer {
        static Render(): void;
        static ClearBuffers(): void;
        static RenderObject(gameObject: GameObject): void;
        private static BindAttributes;
        private static SetObjectUniforms;
        private static SetGlobalUniforms;
        CalculateNormalMatrix(): Matrix3;
        private static Draw;
    }
}
declare module "Utility/Tree" {
    import List from "Utility/List";
    export class TreeNode<T> {
        Value: T;
        Children: List<TreeNode<T>>;
        constructor(children: number, value?: T);
    }
    export default class Tree<T> {
        private readonly size;
        private root;
        constructor(size?: number);
        Add(value: TreeNode<T> | T): void;
    }
}
declare module "Utility/BinaryTree" {
    import Tree from "Utility/Tree";
    export default class BinaryTree<T> extends Tree<T> {
        constructor();
    }
}
declare module "Utility/Control" {
    import Updateable from "Interfaces/Updateable";
    export default class Control implements Updateable {
        Running: boolean;
        private AnimationFrame;
        constructor();
        private Run;
        Update(): void;
        Start(): void;
        Pause(): void;
        Stop(): void;
    }
}
declare module "Utility/FWGEEvent" {
    import GameItem from "GameItem";
    export default class FWGEEvent {
        Target: GameItem;
        TimeStamp: number;
        Type: string;
        constructor();
    }
}
declare module "Utility/Time" {
    import Updateable from "Interfaces/Updateable";
    export default class Time implements Updateable {
        private _now;
        private _then;
        RenderUpdate: number;
        PhysicsUpdate: number;
        readonly Delta: number;
        readonly RenderDelta: number;
        readonly PhysicsDelta: number;
        readonly Now: Date;
        Update(): void;
    }
}
declare module "Utility/Converter/Converter" {
    import GameObject from "GameObject";
    export default class Converter {
        static Parse(): GameObject;
    }
}
declare module "Utility/Converter/OBJConverter" {
    import Converter from "Utility/Converter/Converter";
    import GameObject from "GameObject";
    import Mesh from "Render/Mesh";
    import RenderMaterial from "Render/RenderMaterial";
    export default class OBJConverter implements Converter {
        static Parse(obj: string, mtl: string): GameObject;
        static ParseMesh(obj: string): Mesh;
        static ParseRenderMaterial(mtl: string): RenderMaterial;
    }
}
