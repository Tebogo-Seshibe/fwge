import { GL, radian } from "@fwge/common"
import { Camera, Entity, getComponent, Mesh, Scene, Shader, StaticMesh, System, Transform } from "@fwge/core"
import { Collider, CubeCollider, SphereCollider } from "@fwge/physics"

export class ColliderRenderSystem extends System
{
    _sphereOutlineMesh!: Mesh
    _cubeOutlineMesh!: Mesh
    _outlineShader!: Shader
    _colliderTypes: Map<string, number[]> = new Map()

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Collider ] })
    }

    Init(): void
    {
        // this.buildResources()
    }

    Start(): void { }
    
    Update(_: number): void
    {
    //     if (!Camera.Main)
    //     {
    //         return
    //     }
        
    //     for (const [ colliderType, transforms ] of this._colliderTypes)
    //     {
    //         this._useShader()
            
    //         let mesh!: StaticMesh
    //         switch (colliderType)
    //         {
    //             case SphereCollider.name:                    
    //                 mesh = this._sphereOutlineMesh
    //                 break

    //             case CubeCollider.name:
    //                 mesh = this._cubeOutlineMesh
    //                 break
    //         }
            

    //         GL.bindVertexArray(mesh.VertexArrayBuffer)
    //         for (const transformId of transforms)
    //         {
    //             const transform = getComponent(Transform, transformId)
    //             const collider = transform.Owner!.GetComponent(Collider)
    //             if (collider instanceof SphereCollider)
    //             {
    //                 transform.Scale.Multiply(collider.Radius)
    //                 GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.FaceBuffer)
    //             }
    //             else if (collider instanceof CubeCollider)
    //             {
    //                 transform.Scale.Multiply(collider.Width, collider.Height, collider.Depth)
    //                 GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.FaceBuffer)
    //             }
                
    //             GL.uniformMatrix4fv(this._outlineShader.Matrices!.ModelView, true, transform.ModelViewMatrix())
    //             GL.drawElements(GL.LINES, mesh.FaceCount, GL.UNSIGNED_BYTE, 0)
                
    //             if (collider instanceof SphereCollider)
    //             {
    //                 transform.Scale.Divide(collider.Radius)
    //             }
    //             else if (collider instanceof CubeCollider)
    //             {
    //                 transform.Scale.Divide(collider.Width, collider.Height, collider.Depth)
    //             }
    //         }
    //         GL.bindVertexArray(null)
    //     }
    }

    Stop(): void { }

    // private _useShader()
    // {
    //     const shader = this._outlineShader
    //     GL.useProgram(shader.Program)
    //     GL.uniformMatrix4fv(shader.Matrices!.View, true, Camera.Main!.ViewMatrix)
    //     GL.uniformMatrix4fv(shader.Matrices!.Projection, true, Camera.Main!.ProjectionMatrix)
    // }

    // private buildResources()
    // {
    //     const segments = 16
    //     const jump = 90 / segments
        
    //     const values = []
    //     for (let i = 0; i < segments; ++i)
    //     {
    //         values.push(Math.cos(radian(jump * i)))
    //     }

    //     const left = [
    //         ...values.map(x => x), 
    //         0,
    //         ...values.map(x => -x).slice(1).reverse(),
    //         ...values.map(x => -x),
    //         0,
    //         ...values.map(x => x).slice(1).reverse(),
    //     ]
    //     const right = [
    //         0,
    //         ...values.map(x => x).reverse(),
    //         ...values.map(x => x).slice(1),
    //         0,
    //         ...values.map(x => -x).reverse(),
    //         ...values.map(x => -x).slice(1),
    //     ]

    //     const x = left.map((_, i) => [0, left[i], right[i]])
    //     x.push([0, left[0], right[0]])
    //     const y = left.map((_, i) => [left[i], 0, right[i]])
    //     y.push([left[0], 0, right[0]])
    //     const z = left.map((_, i) => [left[i], right[i], 0])
    //     z.push([left[0], right[0], 0])

    //     const position = [...x, ...y, ...z] as [number, number, number][]
    //     const index = []
    //     for (let i = 0; i < x.length - 1; ++i)
    //     {
    //         index.push(i, i + 1)
    //     }
    //     index.push(...index.map(i => i + x.length))
    //     index.push(...index.map(i => i + y.length + z.length))

    //     this._cubeOutlineMesh = new StaticMesh(
    //     {
    //         position:
    //         [
    //             [-0.5, 0.5, 0.5],
    //             [-0.5,-0.5, 0.5],
    //             [ 0.5,-0.5, 0.5],
    //             [ 0.5, 0.5, 0.5],

    //             [-0.5, 0.5,-0.5],
    //             [-0.5,-0.5,-0.5],
    //             [ 0.5,-0.5,-0.5],
    //             [ 0.5, 0.5,-0.5],
    //         ],
    //         index: [
    //             0,1, 1,2, 2,3, 3,0, // FRONT
    //             4,5, 5,6, 6,7, 7,4, // BACK
    //             4,0, 0,3, 3,7, 7,4, // TOP
    //             1,5, 5,6, 6,2, 2,1, // BOTTOM
    //             4,5, 5,1, 1,0, 0,4, // LEFT
    //             3,2, 2,6, 6,7, 7,3, // RIGHT
    //         ]
    //     })
        
    //     this._sphereOutlineMesh = new StaticMesh({ position, index })
        
    //     this._outlineShader = new ShaderAsset(
    //     {
    //         vertexShader:
    //         {
    //             source: `#version 300 es

    //             layout(location = 0) in vec4 A_Position;
    //             layout(location = 4) in mat4 A_ModelViewMatrix;

    //             struct Matrix
    //             {
    //                 mat4 ModelView;
    //                 mat4 View;
    //                 mat4 Projection;
    //             };
    //             uniform Matrix U_Matrix;

    //             void main(void)
    //             {
    //                 gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * A_Position;
    //             }`,
    //             input: []
    //         },
    //         fragmentShader:
    //         {
    //             source: `#version 300 es
                
    //             precision mediump float;
    //             out vec4 OutColour;

    //             void main(void)
    //             {
    //                 OutColour = vec4(0.0, 1.0, 0.0, 1.0);
    //             }`,
    //             input: []
    //         }
    //     })
    // }

    // override OnUpdateEntity(entity: Entity): void
    // {
    //     super.OnUpdateEntity(entity)

    //     const collider = entity.GetComponent(Collider)
    //     const transform = entity.GetComponent(Transform)!
    //     if (collider)
    //     {
    //         let name = ''
    //         if (collider instanceof CubeCollider)
    //         {
    //             name = CubeCollider.name
    //         }
    //         else if (collider instanceof SphereCollider)
    //         {
    //             name = SphereCollider.name
    //         }

    //         const colliderList = this._colliderTypes.get(name) ?? []
    //         this._colliderTypes.set(name, [transform.Id, ...colliderList])
    //     }
    // }
}
