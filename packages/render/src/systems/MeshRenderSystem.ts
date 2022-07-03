import { GL, Vector3 } from '@fwge/common'
import { Entity, System, Transform } from '@fwge/core'
import { DepthType, RenderTarget, ShaderAsset } from '../base'
import { Camera, Material, Mesh, PointLight, StaticMesh } from '../components'
import { Light } from '../components/lights/Light'

export class MeshRenderSystem extends System
{
    private _hasSampler: WebGLUniformLocation[] = new Array(8)
    private _example!: RenderTarget
 
    private _screenFramebuffer!: WebGLFramebuffer
    private _screenTexture!: WebGLTexture
    private _screenShader!: ShaderAsset
    private _screenTransform: Transform = new Transform()
    private _screenMesh!: StaticMesh
    private _screenMaterial!: Material

    private _lights: Set<Light> = new Set()
    private _cameras: Set<Camera> = new Set()
    private _materials: Set<Material> = new Set()
    private _wireframeShader: ShaderAsset | null = null
    private _gridShader: ShaderAsset | null = null

    public RenderGrid: boolean = true
    public Min: number = -10
    public Max: number = 10
    public Step: number = 1
    public Wireframe: boolean = false
    public GridBuffer: WebGLBuffer = GL.createBuffer()!

    private _batches: Map<Material, Entity[]> = new Map()
    private _orderedBatches: Material[] = []

    constructor(args?: { renderGrid: boolean, min: number, max: number, step: number, wireframe: boolean })
    {
        super({ requiredComponents: [ Transform, Mesh, Material ] })

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
        this._screenFramebuffer = GL.createFramebuffer()!
        GL.bindFramebuffer(GL.FRAMEBUFFER, this._screenFramebuffer)

        this._screenTexture = GL.createTexture()!
        GL.bindTexture(GL.TEXTURE_2D, this._screenTexture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1920, 1080, 0, GL.RGBA, GL.UNSIGNED_BYTE, null)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this._screenTexture, 0)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)

        this._example = new RenderTarget(
        {
            attachments: [
                ...new Array(7).fill(() => (
                {
                    height: 1080,
                    width: 1920,
                })),
                {
                    height: 1080,
                    width: 1920,
                    colour: { },
                    depth: { type: DepthType.INT16 }
                }
            ]
        })

        this._buildWireframeShader()
        this._buildGridShader()
        this._createRenderBatches()
        this._buildScreenShader()

        for (let i = 0; i < 8; ++i)
        {
            this._hasSampler[i] = GL.getUniformLocation(this._screenShader.Program!, `hasSampler[${i}]`)!
        }
        
        this._screenMaterial.Shader = this._screenShader
    }

    private _createRenderBatches()
    {
        const transparent: Material[] = []
        for (const entity of this.entities)
        {
            const material = entity.GetComponent(Material)!

            if (!this._batches.has(material))
            {
                this._batches.set(material, [])
            }

            this._batches.get(material)!.push(entity)
            if (material.Alpha === 1 && !material.HasTransparency)
            {
                this._orderedBatches.push(material)
            }
            else
            {
                transparent.push(material)
            }
        }
        this._orderedBatches.push(...transparent)
    }

    private _buildGridShader()
    {
        this._gridShader = new ShaderAsset(
            {
                vertexShader: {
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
                }`,
                    input: []
                },
                fragmentShader: {
                    source: `#version 300 es
                precision highp float;

                out vec4 colour;
                vec2 V_Position;
                void main()
                {
                    colour = vec4(1.0);
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
                layout(location = 1) in vec3 A_Normal;
                layout(location = 2) in vec2 A_UV;
                layout(location = 3) in vec3 A_Colour;

                out vec2 V_UV;
                void main()
                {
                    V_UV =  A_UV;
                    gl_PointSize = 50.0;
                    gl_Position = vec4(A_Position, 1.0);
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;

                uniform bool hasSampler[8];
                uniform sampler2D Source[8];

                in vec2 V_UV;
                out vec4 colour;
                void main()
                {
                    colour = vec4(0.0);
                    
                    // if (hasSamples[6]) colour += texture(Source[6], V_UV);
                    if (hasSampler[7]) colour += texture(Source[7], V_UV);
                }`,
                input: []
            }
        })

        this._screenMesh = new StaticMesh(
        {
            position: [
                [-1.0,  1.0, 0.0 ],
                [-1.0, -1.0, 0.0 ],
                [ 1.0, -1.0, 0.0 ],
                [-1.0,  1.0, 0.0 ],
                [ 1.0, -1.0, 0.0 ],
                [ 1.0,  1.0, 0.0 ],
            ],
            normal: [
                [ 0.0, 0.0, 0.0 ],
                [ 0.0, 0.0, 0.0 ],
                [ 0.0, 0.0, 0.0 ],
                [ 0.0, 0.0, 0.0 ],
                [ 0.0, 0.0, 0.0 ],
                [ 0.0, 0.0, 0.0 ],
            ],
            uv: [
                [ 0.0, 1.0 ],
                [ 0.0, 0.0 ],
                [ 1.0, 0.0 ],
                [ 0.0, 1.0 ],
                [ 1.0, 0.0 ],
                [ 1.0, 1.0 ],
            ],
            colour: [
                [ 1.0, 1.0, 1.0, 1.0 ],
                [ 1.0, 1.0, 1.0, 1.0 ],
                [ 1.0, 1.0, 1.0, 1.0 ],
                [ 1.0, 1.0, 1.0, 1.0 ],
                [ 1.0, 1.0, 1.0, 1.0 ],
                [ 1.0, 1.0, 1.0, 1.0 ],
            ]
        })
        
        this._screenMaterial = new Material()
    }

    Start(): void { }
    Stop(): void { }

    Update(delta: number): void
    {        
        if (!Camera.Main)
        {
            return
        }

        // GL.bindFramebuffer(GL.FRAMEBUFFER, this._example.Framebuffer)
        // GL.enable(GL.DEPTH_TEST)
        
        // if (this.RenderGrid)
        // {
            this._drawGrid()
        // }
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0,0,0,1)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

        for (const material of this._orderedBatches)
        {
            const entityList = this._batches.get(material)!
            const shader = material.Shader
            if (!shader) continue

            GL.enable(GL.DEPTH_TEST)
            GL.enable(GL.CULL_FACE)
            GL.depthMask(true)
            if (!material.HasTransparency)
            {
                GL.disable(GL.BLEND)
            }
            else
            {
                GL.enable(GL.BLEND)
                GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)
            }

            this._useShader(shader)
            this._bindLightUniforms(shader)
            this._bindMaterialUniforms(material, shader)
            this._bindMaterialTexture(material, shader)

            for (const entity of entityList)
            {
                const transform = entity.GetComponent(Transform)!
                const mesh = entity.GetComponent(Mesh)!

                this._drawMesh(transform, mesh, shader)
            }

            this._unbindMaterialTexture()
        }

        // if (this.Wireframe)
        // {
        //     this._useShader(this._wireframeShader!)
        //     for (const entity of this.entities)
        //     {
        //         const transform = entity.GetComponent(Transform)!
        //         const mesh = entity.GetComponent(Mesh)!

        //         this._drawMeshWireframe(transform, mesh)
        //     }
        // }

        // this._drawToScreen()
        // this._unbindMaterialTexture()
        GL.useProgram(null)
    }

    private _drawToScreen(): void
    {
        this._useShader(this._screenShader)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)

        GL.clearColor(0,0,0,0)
        GL.disable(GL.DEPTH_TEST)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        
        for (let i = 0; i < this._example.ColourTextures.length; ++i)
        {
            const texture = this._example.ColourTextures[i]
            // const texture = this._example.DepthStencilTextures[i]
            if (texture)
            {
                GL.activeTexture(GL.TEXTURE0)
                GL.bindTexture(GL.TEXTURE_2D, texture)
                GL.uniform1i(this._hasSampler[i], 1)
            }
            else
            {
                GL.uniform1i(this._hasSampler[i], 0)
            }
        }

        this._drawMesh(this._screenTransform, this._screenMesh, this._screenShader)
    }

    private _drawGrid()
    {
        GL.useProgram(this._gridShader!.Program)
        GL.uniformMatrix4fv(this._gridShader!.Matrices!.View, false, Camera.Main!.ViewMatrix)
        GL.uniformMatrix4fv(this._gridShader!.Matrices!.Projection, false, Camera.Main!.ProjectionMatrix)

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
        const mv = transform.ModelViewMatrix
        const norm = mv.Matrix3.Inverse()

        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(shader.Matrices!.ModelView, true, mv)
        GL.uniformMatrix3fv(shader.Matrices!.Normal, true, norm)

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

    private _drawMeshWireframe(transform: Transform, mesh: Mesh): void
    {
        const mv = transform.ModelViewMatrix
        const norm = mv.Matrix3.Inverse()

        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(this._wireframeShader!.Matrices!.ModelView, false, mv)
        GL.uniformMatrix3fv(this._wireframeShader!.Matrices!.Normal, false, norm)

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer)
        GL.drawElements(GL.LINES, mesh.WireframeCount, GL.UNSIGNED_BYTE, 0)

        GL.bindVertexArray(null)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }

    private _useShader(shader: ShaderAsset)
    {
        // console.log(Camera.Main!.Projection)
        GL.useProgram(shader.Program)
        GL.uniformMatrix4fv(shader.Matrices!.View, true, Camera.Main!.ViewMatrix)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, true, Camera.Main!.ProjectionMatrix)
    }

    private _bindMaterialUniforms(material: Material, shader: ShaderAsset)
    {
        GL.uniform4f(
            shader.Material!.AmbientColour,
            material.Ambient[0] / 255,
            material.Ambient[1] / 255,
            material.Ambient[2] / 255,
            material.Ambient[3] / 255,
        )
        GL.uniform4f(
            shader.Material!.DiffuseColour,
            material.Diffuse[0] / 255,
            material.Diffuse[1] / 255,
            material.Diffuse[2] / 255,
            material.Diffuse[3] / 255,
        )
        GL.uniform4f(
            shader.Material!.SpecularColour,
            material.Specular[0] / 255,
            material.Specular[1] / 255,
            material.Specular[2] / 255,
            material.Specular[3] / 255,
        )
        GL.uniform1f(shader.Material!.Shininess, material.Shininess)
        GL.uniform1f(shader.Material!.Alpha, material.Alpha)
    }

    private _bindMaterialTexture(material: Material, shader: ShaderAsset)
    {
        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(shader.Material!.HasImageMap, 1)
            GL.uniform1i(shader.Material!.ImageSampler, 0)
        }

        if (material.NormalTexture)
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, material.NormalTexture)
            GL.uniform1i(shader.Material!.BumpSampler, 0)
        }

        if (material.SpecularTexture)
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, material.SpecularTexture)
            GL.uniform1i(shader.Material!.SpecularSampler, 0)
        }
    }

    private _unbindMaterialTexture()
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE3)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE4)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE5)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE6)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE7)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE8)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE9)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE10)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE11)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE12)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE13)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE14)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.activeTexture(GL.TEXTURE15)
        GL.bindTexture(GL.TEXTURE_2D, null)
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
