import { GL } from "@fwge/common"
import { System, Transform } from "@fwge/core"
import { Collider, CubeCollider, SphereCollider } from "@fwge/physics"
import { Camera, Mesh, ShaderAsset, StaticMesh } from "@fwge/render"

export class ColliderRenderSystem extends System
{
    sphereOutlineMesh!: Mesh
    cubeOutlineMesh!: Mesh
    sphereColliderShader!: ShaderAsset
    cameraPosition!: WebGLUniformLocation
    cubeColliderShader!: ShaderAsset

    constructor()
    {
        super({ requiredComponents: [ Transform, Collider ] })
    }

    Init(): void
    {
        this.buildSphereOutlineTools()
        this.buildCubeOutlineTools()
        
    }
    Start(): void
    {
        console.log(this)
    }
    
    Update(_: number): void
    {
        GL.enable(GL.BLEND)
        GL.blendFunc(GL.ONE, GL.ONE)
        
        for (const entity of this.entities)
        {
            const transform = entity.GetComponent(Transform)!
            const collider = entity.GetComponent(Collider)!
            
            if (collider instanceof SphereCollider)
            {
                this._useShader(this.sphereColliderShader)
                this._drawMesh(transform, this.sphereOutlineMesh, this.sphereColliderShader)
            }
            else if (collider instanceof CubeCollider)
            {
                this._useShader(this.cubeColliderShader)
                this._drawMeshOutline(transform, this.cubeOutlineMesh, this.cubeColliderShader)
            }
        }
    }

    Stop(): void
    {
        console.log('Done!')
    }

    private _drawMesh(transform: Transform, mesh: Mesh, shader: ShaderAsset): void
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(shader.Matrices!.ModelView, false, transform.ModelViewMatrix)

        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
            GL.drawElements(GL.TRIANGLES, mesh.IndexCount, GL.UNSIGNED_BYTE, 0)
        }
        else
        {
            GL.drawArrays(GL.TRIANGLES, 0, mesh.VertexCount)
        }

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
        GL.bindVertexArray(null)
    }

    private _drawMeshOutline(transform: Transform, mesh: Mesh, shader: ShaderAsset): void
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(shader.Matrices!.ModelView, false, transform.ModelViewMatrix)

        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
            GL.drawElements(GL.LINES, mesh.IndexCount, GL.UNSIGNED_BYTE, 0)
        }
        else
        {
            GL.drawArrays(GL.LINES, 0, mesh.VertexCount)
        }

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
        GL.bindVertexArray(null)
    }

    private _useShader(shader: ShaderAsset)
    {
        GL.useProgram(shader.Program)
        GL.uniformMatrix4fv(shader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, false, Camera.Main!.Projection)
    }

    private buildSphereOutlineTools()
    {
        this.sphereOutlineMesh = new StaticMesh(
        {
            position:
            [
                [-0.5, 0.5, 0.0],
                [-0.5,-0.5, 0.0],
                [ 0.5,-0.5, 0.0],
                [ 0.5, 0.5, 0.0],
                
                [-0.5, 0.0, 0.5],
                [-0.5, 0.0,-0.5],
                [ 0.5, 0.0,-0.5],
                [ 0.5, 0.0, 0.5],

                [ 0.0,-0.5, 0.5],
                [ 0.0,-0.5,-0.5],
                [ 0.0, 0.5,-0.5],
                [ 0.0, 0.5, 0.5],
            ],
            uv:
            [                
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],

                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
            ],
            index:
            [
                 0, 1, 2, 0, 2, 3,
                 3, 2, 1, 2, 1, 0,
                 4, 5, 6, 4, 6, 7,
                 7, 6, 4, 6, 5, 4,
                 8, 9,10, 8,10,11,
                11,10, 8,10, 9, 8,
            ]
        })
        
        this.sphereColliderShader = new ShaderAsset(
        {
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec4 A_Position;
                layout(location = 2) in vec2 A_UV;
                layout(location = 4) in mat4 A_ModelViewMatrix;

                out vec4 V_Position;
                out vec2 V_UV;

                struct Matrix
                {
                    mat4 ModelView;
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                void passVertexData()
                {
                    V_Position = U_Matrix.ModelView * A_Position;
                    V_UV = A_UV;
                }

                void main(void)
                {
                    passVertexData();

                    gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision mediump float;
                in vec4 V_Position;
                in vec2 V_UV;
                out vec4 OutColour;

                void main(void)
                {
                    float thickness = 0.01;
                    float fade = 0.005;

                    vec2 screen = (V_UV - 0.5) * 2.0;
                    float distance = 1.0 - length(screen);

                    float inner = smoothstep(0.0, fade, distance);
                    float outer = smoothstep(thickness, thickness - fade, distance);
                    float value = outer * inner;
                    
                    OutColour = vec4(0.0, value, 0.0, 1.0);
                }`,
                input: []
            }
        })
    }

    private buildCubeOutlineTools()
    {
        this.cubeOutlineMesh = new StaticMesh(
        {
            position:
            [
                [-0.5, 0.5, 0.5],
                [-0.5,-0.5, 0.5],
                [ 0.5,-0.5, 0.5],
                [ 0.5, 0.5, 0.5],

                [-0.5, 0.5,-0.5],
                [-0.5,-0.5,-0.5],
                [ 0.5,-0.5,-0.5],
                [ 0.5, 0.5,-0.5],
            ],
            index: [
                0,1, 1,2, 2,3, 3,0, // FRONT
                4,5, 5,6, 6,7, 7,4, // BACK
                4,0, 0,3, 3,7, 7,4, // TOP
                1,5, 5,6, 6,2, 2,1, // BOTTOM
                4,5, 5,1, 1,0, 0,4, // LEFT
                3,2, 2,6, 6,7, 7,3, // RIGHT
            ]
        })
        this.cubeColliderShader = new ShaderAsset(
        {
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec4 A_Position;
                layout(location = 4) in mat4 A_ModelViewMatrix;

                struct Matrix
                {
                    mat4 ModelView;
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                void main(void)
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * A_Position;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision mediump float;
                out vec4 OutColour;

                void main(void)
                {
                    OutColour = vec4(0.0, 1.0, 0.0, 1.0);
                }`,
                input: []
            }
        })
    }
}



