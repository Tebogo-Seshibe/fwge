import { GL, Matrix3, Matrix4, Vector3 } from "@fwge/common"
import { Scene, Shader } from "../base"
import { AreaLight, BasicLitMaterial, Camera, DirectionalLight, Light, Material, PointLight, Renderer, RenderMode, Transform } from "../components"
import { EntityId, getComponent, getComponentById, System, view } from "../ecs"

export class DeferredRenderSystem extends System
{
    _prepassShader!: Shader
    _lightPassShader!: Shader
    _batch!: Map<number, Map<number, Set<number>>>
    _modelViewMatrices: Map<number, Matrix4> = new Map()
    _normalMatrices: Map<number, Matrix3> = new Map()

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Material, Renderer ] })
    }

    Init()
    {
        this._prepassShader = new Shader(prepassVert, prepassFrag)
        this._lightPassShader = new Shader(mainPassVert, mainPassFrag)

        view([Light], { name: PointLight.name, exec: light => light instanceof PointLight })
        view([Light], { name: DirectionalLight.name, exec: light => light instanceof DirectionalLight })
        view([Light], { name: AreaLight.name, exec: light => light instanceof AreaLight })

        this._createBatch(view([ Transform, Material, Renderer ]))
    }
    
    private _createBatch(entities: EntityId[]): void
    {
        const map = new Map<number, Map<number, Set<number>>>()

        for (const entityId of entities)
        {
            const material = getComponent(entityId, Material)!
            const renderer = getComponent(entityId, Renderer)!
            const transform = getComponent(entityId, Transform)!

            const rendererMap = map.get(material.Id) ?? new Map<number, Set<number>>()
            const transformSet = rendererMap.get(renderer.Id) ?? new Set<number>()

            rendererMap.set(renderer.Id, new Set([...transformSet, transform.Id]))
            map.set(material.Id, rendererMap)
            
            this._modelViewMatrices.set(transform.Id, Matrix4.Identity)
            this._normalMatrices.set(transform.Id, Matrix3.Identity)
        }

        this._batch = map
    }

    Start(){}
    Stop(){}

    Update(_: number)
    {
        GL.enable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
        GL.cullFace(GL.BACK)
        GL.depthMask(true)

        for (const window of this.Scene.Windows)
        {
            window.MainPass.Output.Bind()
            this.prepassRender(window.Camera)

            // for (const step of window.RenderPipeline)
            // {
            //     step.Output.Bind()
            //     step.Shader!.Bind()

            //     for (const inputName of step.Input)
            //     {
            //         if (!window.RenderPipelineMap.has(inputName))
            //         {
            //             continue
            //         }

            //         const inputIndex = window.RenderPipelineMap.get(inputName)!
            //         const input = inputIndex === -1
            //             ? window.MainPass
            //             : window.RenderPipeline[inputIndex]

            //         for (let outputIndex = 0; outputIndex < input.Output.ColourAttachments.length; ++outputIndex)
            //         {
            //             step.Shader!.SetTexture(`U_${inputName}_Colour[${outputIndex}]`, input.Output.ColourAttachments[outputIndex]!)
            //         }
            //         step.Shader!.SetTexture(`U_${inputName}_Depth`, input.Output.DepthAttachment!)
            //     }

            //     step.Shader!.SetFloat('U_Width', step.Output.Width)
            //     step.Shader!.SetFloat('U_Height', step.Output.Height)

            //     GL.bindVertexArray(window.Panel.VertexArrayBuffer)
            //     GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer)
            //     GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0)
            //     GL.bindVertexArray(null)

            //     step.Shader!.UnBind()
            //     step.Output.UnBind()
            // }
        }

        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0, 0, 0, 0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT)

        this._lightPassShader.Bind()
        this._lightPassShader.Reset()
        for (let i = this.Scene.Windows.length - 1; i >= 0; --i)
        {
            const window = this.Scene.Windows[i]

            this._lightPassShader.SetTexture(`U_Position`, window.FinalComposite.ColourAttachments[0])
            this._lightPassShader.SetTexture(`U_Normal`, window.FinalComposite.ColourAttachments[1])
            this._lightPassShader.SetTexture(`U_ColourSpecular`, window.FinalComposite.ColourAttachments[2])
            this._lightPassShader.SetTexture(`U_Depth`, window.FinalComposite.DepthAttachment!)
            this._lightPassShader.SetFloatVector('U_PanelOffset', window.Offset)
            this._lightPassShader.SetFloatVector('U_PanelScale', window.Scale)

            this.bindLights()
                
            GL.bindVertexArray(window.Panel.VertexArrayBuffer)
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer)
            GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0)
            GL.bindVertexArray(null)
        }
        this._lightPassShader.UnBind()
    }

    private bindLights()
    {
        let a = 0
        let d = 0
        let p = 0

        for (const entityId of view([Light], AreaLight.name))
        {
            const light = getComponent(entityId, Light)! as AreaLight
            const shader = this._lightPassShader
            
            shader.SetFloatVector(`U_AreaLight[${a}].Colour`, light.Colour)
            shader.SetFloat(`U_AreaLight[${a}].Intensity`, light.Intensity)
            
            a++
        }

        for (const entityId of view([Light], DirectionalLight.name))
        {
            const light = getComponent(entityId, Light)! as DirectionalLight
            const shader = this._lightPassShader
            
            shader.SetFloatVector(`U_DirectionalLight[${d}].Colour`, light.Colour)
            shader.SetFloat(`U_DirectionalLight[${d}].Intensity`, light.Intensity)

            shader.SetFloatVector(`U_DirectionalLight[${d}].Direction`, light.Direction)
            // shader.SetFloat(`U_DirectionalLight[${d}].Radius`, light.Radius)

            d++
        }
        
        for (const entityId of view([Light], PointLight.name))
        {
            const light = getComponent(entityId, Light)! as PointLight
            const shader = this._lightPassShader
            
            const position = light.Owner?.GetComponent(Transform)?.GlobalPosition() ?? Vector3.Zero
            shader.SetFloatVector(`U_PointLight[${p}].Colour`, light.Colour)
            shader.SetFloat(`U_PointLight[${p}].Intensity`, light.Intensity)

            shader.SetFloatVector(`U_PointLight[${p}].Position`, position)
            shader.SetFloat(`U_PointLight[${p}].Radius`, light.Radius)
            
            p++
        }

        this._lightPassShader.SetInt(`U_AreaLightCount`, a)
        this._lightPassShader.SetInt(`U_DirectionalLightCount`, d)
        this._lightPassShader.SetInt(`U_PointLightCount`, p)
    }

    private prepassRender(camera: Camera)
    {        
        const projection = camera.ProjectionMatrix
        const view = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity
        
        this._prepassShader.Bind()
        this._prepassShader.SetMatrix('U_Matrix.View', view, true)
        this._prepassShader.SetMatrix('U_Matrix.Projection', projection, true)

        for (const [materialId, renderers] of this._batch)
        {
            const material = getComponentById(Material, materialId)!
            this._prepassShader.Reset()
            material.Bind(this._prepassShader)
            
            for (const [rendererId, transforms] of renderers)
            {
                const renderer = getComponentById(Renderer, rendererId)!

                const mesh = renderer.Asset!
                let mode = -1
                let count = 0
                let buffer = null
                
                switch (renderer.RenderMode)
                {
                    case RenderMode.FACE:
                    {
                        mode = GL.TRIANGLES
                        count = mesh.FaceCount

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.FaceBuffer
                        }
                    }
                    break

                    case RenderMode.EDGE:
                    {
                        mode = GL.LINES
                        count = mesh.EdgeCount

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.EdgeBuffer
                            mode = GL.LINES
                        }
                    }
                    break

                    case RenderMode.POINT:
                    {
                        mode = GL.POINTS
                        count = mesh.PointCount

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.PointBuffer
                        }
                    }
                    break
                }
                
                GL.bindVertexArray(mesh.VertexArrayBuffer)
                for (const transformId of transforms)
                {
                    const transform = getComponentById(Transform, transformId)!
                    const modelView = this._modelViewMatrices.get(transformId)!
                    const normal = this._normalMatrices.get(transformId)!

                    transform.ModelViewMatrix(modelView)
                    Matrix3.Inverse(modelView.Matrix3.Transpose(), normal)
                    
                    this._prepassShader.SetMatrix('U_Matrix.ModelView', modelView, true)
                    this._prepassShader.SetMatrix('U_Matrix.Normal', normal, true)

                    if (buffer)
                    {
                        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
                        GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0)
                    }
                    else
                    {
                        GL.drawArrays(mode, 0, count)
                    }
                }
                GL.bindVertexArray(null)
            }
            material.UnBind()
        }
        this._prepassShader.UnBind()
    }
    
    private prepassShadowRender(camera: Camera)
    {        

        const projection = camera.ProjectionMatrix
        const modelview = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity

        for (const entityId of view([Transform, Material, Renderer]))
        {
            const material = getComponent(entityId, Material)!
            const renderer = getComponent(entityId, Renderer)!
            const transform = getComponent(entityId, Transform)!
            
            material.Bind()
            this._prepassShader.Bind()
            this._prepassShader.SetMatrix('U_Matrix.View', modelview, true)
            this._prepassShader.SetMatrix('U_Matrix.Projection', projection, true)
            const shader = this._prepassShader

            if (material instanceof BasicLitMaterial)
            {
                shader.SetFloat(`U_Material.Shininess`, material.Shininess)
                shader.SetFloat(`U_Material.Alpha`, material.Alpha)
                shader.SetBool(`U_Material.ReceiveShadows`, material.ReceiveShadows)
                shader.SetFloatVector('U_Material.Ambient', material.Ambient)
                shader.SetFloatVector('U_Material.Diffuse', material.Diffuse)
                shader.SetFloatVector('U_Material.Specular', material.Specular)
                shader.SetFloatVector('U_Material.Colour', material.Colour)
        
                if (material.Textures[0])
                {
                    // shader.SetTexture('U_Sampler.Image', this.Textures[0])
                    shader.SetTexture('U_Sampler.Image', material.AmbientTexture.Texture)
                }
                else
                {
                    shader.SetTexture('U_Sampler.Image', Material.Empty)
                }
        
                if (material.Textures[1])
                {
                    shader.SetTexture('U_Sampler.Bump', material.Textures[1])
                }
                else
                {
                    shader.SetTexture('U_Sampler.Bump', Material.Empty)
                }
        
                if (material.Textures[2])
                {
                    shader.SetTexture('U_Sampler.Shadow', material.Textures[2])
                }
                else
                {
                    shader.SetTexture('U_Sampler.Shadow', Material.Empty)
                }  
            } 

            const mesh = renderer.Asset!
            let mode = -1
            let count = 0
            let buffer = null
            
            switch (renderer.RenderMode)
            {
                case RenderMode.FACE:
                {
                    mode = GL.TRIANGLES
                    count = mesh.FaceCount

                    if (mesh.IsIndexed)
                    {
                        buffer = mesh.FaceBuffer
                    }
                }
                break

                case RenderMode.EDGE:
                {
                    mode = GL.LINES
                    count = mesh.EdgeCount

                    if (mesh.IsIndexed)
                    {
                        buffer = mesh.EdgeBuffer
                        mode = GL.LINES
                    }
                }
                break

                case RenderMode.POINT:
                {
                    mode = GL.POINTS
                    count = mesh.PointCount

                    if (mesh.IsIndexed)
                    {
                        buffer = mesh.PointBuffer
                    }
                }
                break
            }
            
            GL.bindVertexArray(mesh.VertexArrayBuffer)
            const modelView = transform.ModelViewMatrix() 
            const normal = modelView.Matrix3.Transpose()
            this._prepassShader.SetMatrix('U_Matrix.ModelView', modelView, true)
            this._prepassShader.SetMatrix('U_Matrix.Normal', normal, true)            
            if (buffer)
            {
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
                GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0)
            }
            else
            {
                GL.drawArrays(mode, 0, count)
            }
            GL.bindVertexArray(null)

            this._prepassShader.UnBind()
            material.UnBind()
        }
    }
}


const prepassVert = `#version 300 es
#pragma vscode_glsllint_stage: vert
layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

out vec3 V_Position;
out vec3 V_Normal;
out vec2 V_UV;
out vec3 V_Colour;

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat3 Normal;
    mat4 Projection;
};
uniform Matrix U_Matrix;

void main(void)
{
    vec4 position = U_Matrix.ModelView * vec4(A_Position, 1.0);

    V_Position = position.xyz;
    V_Normal = U_Matrix.Normal * A_Normal;
    V_UV = A_UV;
    V_Colour = A_Colour;

    gl_Position = U_Matrix.Projection * U_Matrix.View * position;
}
`

const prepassFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag
precision highp float;

layout(location = 0) out vec3 O_Position;
layout(location = 1) out vec3 O_Normal;
layout(location = 2) out vec4 O_ColourSpecular;

in vec3 V_Position;
in vec3 V_Normal;
in vec2 V_UV;
in vec3 V_Colour;

struct Material
{
    vec3 Colour;
    float Shininess;
    float Alpha;

    vec3 Ambient;
    vec3 Diffuse;
    vec3 Specular;

    bool HasImageMap;
    bool HasBumpMap;
    bool ReceiveShadows;
};
uniform Material U_Material;

struct Sampler
{
    sampler2D Image;
    sampler2D Bump;
    sampler2D ShadowMap;
    sampler2D DirectionalShadow;
};
uniform Sampler U_Sampler;

void main(void)
{
    vec4 tex = texture(U_Sampler.Image, V_UV);
    vec3 albedo = U_Material.Colour * tex.rgb;
    float alpha = U_Material.Alpha * tex.a;
    
    O_Position = V_Position;
    O_Normal = normalize(V_Normal);
    O_ColourSpecular = vec4(albedo, alpha);
}
`
const mainPassVert = `#version 300 es
#pragma vscode_glsllint_stage: vert

layout(location = 0) in vec2 A_Position;

uniform vec2 U_PanelOffset;
uniform vec2 U_PanelScale;

out vec2 V_UV;

void main(void)
{
    V_UV = A_Position * 0.5 + 0.5;
    gl_Position = vec4((A_Position * U_PanelScale) + U_PanelOffset, 0.0, 1.0);
}`

const mainPassFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag
precision highp float;

layout(location = 0) out vec4 O_FragColour;

in vec2 V_UV;

uniform sampler2D U_Position;
uniform sampler2D U_Normal;
uniform sampler2D U_ColourSpecular;
uniform sampler2D U_Depth;

struct AreaLight
{
    vec3 Colour;
    float Intensity;
};
uniform AreaLight[1] U_AreaLight;

vec3 CalcAreaLight(vec3 colour, float intensity)
{
    return colour * intensity;
}

struct DirectionalLight
{
    vec3 Colour;
    float Intensity;

    vec3 Direction;
    bool CastShadows;

    float TexelSize;
    float TexelCount;
    float Bias;
    float PCFLevel;

    mat4 ShadowMatrix;
};
uniform DirectionalLight[1] U_DirectionalLight;

vec3 CalcDirectionalLight(int index, vec3 normal)
{
    DirectionalLight dir = U_DirectionalLight[index];

    float val = dot(normal, -dir.Direction);
    float diffuse = max(val, 0.0);
    float shadow = 1.0; // - ShadowWeightDirectional(val);

    return dir.Colour * diffuse * dir.Intensity * shadow;
}

struct PointLight
{
    vec3 Colour;
    float Intensity;

    vec3 Position;
    float Radius;
};
uniform PointLight[230] U_PointLight;

vec3 CalcPointLight(vec3 colour, float intensity, vec3 lightPosition, float radius, float shininess, vec3 fragNormal, vec3 fragPosition)
{
    vec3 difference = lightPosition - fragPosition;
    vec3 direction = normalize(difference);
    vec3 eye = normalize(-fragNormal);
    vec3 reflection = reflect(direction, fragNormal);
    float len = length(difference);

    float diffuseWeight = max(0.0, dot(fragNormal, direction));
    float specularWeight = pow(max(0.0, dot(reflection, eye)), shininess);

    float attenuation = radius / (len * len);

    vec3 diffuse = colour * diffuseWeight * attenuation;
    vec3 specular = colour * specularWeight * attenuation;

    return (diffuse + specular) * intensity;
}

uniform int U_AreaLightCount;
uniform int U_DirectionalLightCount;
uniform int U_PointLightCount;

void main(void)
{
    vec3 vPosition = texture(U_Position, V_UV).rgb;
    vec3 vNormal = texture(U_Normal, V_UV).rgb;
    vec3 vDiffuse = texture(U_ColourSpecular, V_UV).rgb;
    float vSpecular = texture(U_ColourSpecular, V_UV).a;
    float vDepth = texture(U_Depth, V_UV).r;
    
    vec3 lighting = vec3(0.0);

    for (int i = 0; i < U_AreaLightCount; ++i)
    {
        lighting += CalcAreaLight(U_AreaLight[i].Colour, U_AreaLight[i].Intensity);
    }

    for (int i = 0; i < U_DirectionalLightCount; ++i)
    {
        lighting += CalcDirectionalLight(i, vNormal);
    }

    int items = U_PointLight.length();
    for (int i = 0; i < items; ++i)
    {
        lighting += CalcPointLight(U_PointLight[i].Colour, U_PointLight[i].Intensity, U_PointLight[i].Position, U_PointLight[i].Radius, 32.0, vNormal, vPosition);
    }

    // O_FragColour = vec4(lighting * vDiffuse, 1.0);
    O_FragColour = vec4(vec3(vPosition), 1.0);
    // O_FragColour = vec4(texture(U_RenderImage[1], V_UV).rgb, 1.0);
}`