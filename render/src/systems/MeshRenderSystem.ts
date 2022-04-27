import { GL, Vector2, Vector3 } from '@fwge/common'
import { Entity, EntityId, Scene, System, Transform } from '@fwge/core'
import { ShaderAsset } from '../base'
import { Camera, Material, Mesh, PointLight } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderUniforms } from '../components/shader/ShaderUniforms'

export class MeshRenderSystem extends System
{
    private _screenVAO: WebGLVertexArrayObject | null = null
    private _lights: Set<Light> = new Set()
    private _cameras: Set<Camera> = new Set()
    private _screenShader: ShaderAsset | null = null
    private _wireframeShader: ShaderAsset | null = null
    private _gridShader: ShaderAsset | null = null

    public RenderGrid: boolean = true
    public Min: number = -10
    public Max: number = 10
    public Step: number = 1
    public Wireframe: boolean = false
    public GridBuffer: WebGLBuffer = GL.createBuffer()!

    private _batches: Map<Material, Entity[]> = new Map()

    constructor(manager: Scene, args?: { renderGrid: boolean, min: number, max: number, step: number, wireframe: boolean })
    {
        super(manager,
        {
            requiredComponents: [ Transform, Mesh, Material ]
        })

        if (args)
        {
            this.RenderGrid = args.renderGrid
            this.Min = args.min
            this.Max = args.max
            this.Step = args.step
            this.Wireframe = args.wireframe
        }
    }

    Init(): void
    {
        this._buildScreenShader()
        this._buildWireframeShader()

        for (const entity of this.entities)
        {
            const material = entity.GetComponent(Material)!

            if (!this._batches.has(material))
            {
                this._batches.set(material, [])
            }
            
            this._batches.get(material)!.push(entity)
        }
        this._gridShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                vec2 V_Position;
                void main()
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * vec4(A_Position,  1.0);
                    V_Position = A_Position.xz;
                    gl_PointSize = 40.0;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                vec2 V_Position;
                void main()
                {
                    if (V_Position.x == 0.0 || V_Position.y == 0.0)
                    {
                        colour = vec4(vec3(1.0), 1.0);
                    }
                    else
                    {
                        colour = vec4(vec3(0.3), 1.0);
                    }
                    colour.rg = V_Position;
                }`,
                input: []
            }
        })
    }

    private _buildWireframeShader()
    {
        this._wireframeShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 ModelView;
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;

                void main()
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * vec4(A_Position,  1.0);
                    gl_PointSize = 20.0;
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                void main()
                {
                    colour = vec4(0.0, 1.0, 0.0, 1.0);
                }`,
                input: []
            }
        })
    }

    private _buildScreenShader()
    {
        this._screenShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;
                layout(location = 1) in vec2 A_UV;

                out vec2 V_UV;
                void main()
                {
                    V_UV =  A_UV;
                    gl_Position = vec4(A_Position,  1.0);
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                void main()
                {
                    colour = vec4(1.0);
                }`,
                input: []
            }
        })

        const vertexbuffer = GL.createBuffer()
        const indexBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ARRAY_BUFFER, vertexbuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(
        [
            -0.5,  0.5,    0.0, 1.0,
            -0.5, -0.5,    0.0, 0.0,
             0.5, -0.5,    1.0, 0.0,
             0.5,  0.5,    1.0, 1.0,
        ]), GL.STATIC_DRAW)
        GL.bindBuffer(GL.ARRAY_BUFFER, indexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(
        [
            0, 1, 2,
            0, 2, 3
        ]), GL.STATIC_DRAW)

        this._screenVAO = GL.createVertexArray()
        GL.bindVertexArray(this._screenVAO)
        GL.enableVertexAttribArray(0)
        GL.vertexAttribPointer(0, Vector2.SIZE, GL.FLOAT, false, 16, 0)

        GL.enableVertexAttribArray(1)
        GL.vertexAttribPointer(1, Vector2.SIZE, GL.FLOAT, false, 16, 8)

        GL.bindVertexArray(null)
    }

    Start(): void { }
    Stop(): void { }

    Update(delta: number): void
    {
        if (!Camera.Main)
        {
            return
        }

        if (this.RenderGrid)
        {
            this._drawGrid()
        }

        for (const [material, entityList] of this._batches)
        {
            const shader = material.Shader!

            this._useShader(shader)
            this._bindLightUniforms(shader)
            this._bindMaterialUniforms(material, shader)

            for (const entity of entityList)
            {
                const transform = entity.GetComponent(Transform)!
                const mesh = entity.GetComponent(Mesh)!

                this._drawMesh(transform, mesh, shader)
            }
            
        }
        GL.useProgram(null)
        if (this.Wireframe)
        {
            this._useShader(this._wireframeShader!)
            for (const entity of this.entities)
            {
                const transform = entity.GetComponent(Transform)!
                const mesh = entity.GetComponent(Mesh)!

                this._drawMeshWireframe(transform, mesh)
            }
        }
    }


    private _drawGrid()
    {
        GL.useProgram(this._gridShader!.Program)
        GL.uniformMatrix4fv(this._gridShader!.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(this._gridShader!.Matrices!.Projection, false, Camera.Main!.Projection)

        const vertices: number[] = []

        for (let i = this.Min; i <= this.Max; i += this.Step)
        {
            vertices.push(i, 0, this.Min)
            vertices.push(i, 0, this.Max)

            vertices.push(this.Min, 0, i)
            vertices.push(this.Max, 0, i)
        }

        GL.enableVertexAttribArray(0)
        GL.bindBuffer(GL.ARRAY_BUFFER, this.GridBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.DYNAMIC_DRAW)
        GL.vertexAttribPointer(0, Vector3.SIZE, GL.FLOAT, false, Vector3.BYTES_PER_ELEMENT * Vector3.SIZE, 0)
        GL.drawArrays(GL.LINES, 0, vertices.length / 3)
    }

    private _drawMesh(transform: Transform, mesh: Mesh, shader: ShaderAsset): void
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(shader.Matrices!.ModelView, false, transform.ModelViewMatrix)
        GL.uniformMatrix3fv(shader.Matrices!.Normal, false, transform.NormalMatrix)
        
        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
            GL.drawElements(GL.TRIANGLES, mesh.IndexCount, GL.UNSIGNED_BYTE, 0)
        }
        else
        {
            GL.drawArrays(GL.TRIANGLES, 0, mesh.VertexCount)
        }

        GL.bindVertexArray(null)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }
    
    private _drawMeshWireframe(transform: Transform, mesh: Mesh): void
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(this._wireframeShader!.Matrices!.ModelView, false, transform.ModelViewMatrix)
        GL.uniformMatrix3fv(this._wireframeShader!.Matrices!.Normal, false, transform.NormalMatrix)
        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer)
        GL.drawElements(GL.POINTS, mesh.WireframeCount, GL.UNSIGNED_BYTE, 0)
        
        GL.bindVertexArray(null)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }
    
    private _useShader(shader: ShaderAsset)
    {
        GL.useProgram(shader.Program)
        GL.uniformMatrix4fv(shader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, false, Camera.Main!.Projection)
    }

    private _bindMaterialUniforms(material: Material, shader: ShaderAsset)
    {
        GL.uniform4f(
            shader.Material!.AmbientColour,
            material.Ambient[0],
            material.Ambient[1],
            material.Ambient[2],
            material.Ambient[3],
        )
        GL.uniform4f(
            shader.Material!.DiffuseColour,
            material.Diffuse[0],
            material.Diffuse[1],
            material.Diffuse[2],
            material.Diffuse[3],
        )
        GL.uniform4f(
            shader.Material!.SpecularColour,
            material.Specular[0],
            material.Specular[1],
            material.Specular[2],
            material.Specular[3],
        )
        GL.uniform1f(shader.Material!.Shininess, material.Shininess)
        GL.uniform1f(shader.Material!.Alpha, material.Alpha)
        
        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(shader.Material!.HasImageMap, 1)
            GL.uniform1i(shader.Material!.ImageSampler, 0)
        }
        else
        {
            GL.uniform1i(shader.Material!.HasImageMap, 0)
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.NormalTexture)
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, material.NormalTexture)
            GL.uniform1i(shader.Material!.BumpSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.SpecularTexture)
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, material.SpecularTexture)
            GL.uniform1i(shader.Material!.SpecularSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }
    }

    private _bindLightUniforms(shader: ShaderAsset)
    {
        let point_count: number = 0
        for (let light of this._lights)
        {
            if (light instanceof PointLight)
            {
                const position = light.Owner!.GetComponent(Transform)!.Position

                GL.uniform4f(
                    shader.Lights![point_count].Colour, 
                    light.Colour[0],
                    light.Colour[1],
                    light.Colour[2],
                    light.Colour[3],
                )
                
                GL.uniform3f(
                    shader.Lights![point_count].Position,
                    position[0],
                    position[1],
                    position[2]
                )
                
                GL.uniform1f(shader.Lights![point_count].Intensity, light.Intensity)
                GL.uniform1f(shader.Lights![point_count].Radius, light.Radius)

                ++point_count
            }
        }
    }

    override OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        const camera = entity.GetComponent(Camera)
        if (camera && !this._cameras.has(camera))
        {
            this._cameras.add(camera)
        }
        
        const pointLight = entity.GetComponent(PointLight)
        if (pointLight && !this._lights.has(pointLight))
        {
            this._lights.add(pointLight)
        }
    }
}
