import { Colour4, GL, Matrix3, Matrix4, Vector3, Vector3Array } from "@fwge/common";
import { Scene, Shader } from "../base";
import { AreaLight, Camera, DirectionalLight, Light, Material, PointLight, Renderer, RenderMode, Transform } from "../components";
import { getComponent, getComponentById, System, view } from "../ecs";

export class DeferredRenderSystem extends System
{
    static BlockIndex = new Map<string, any>();
    static BindingPoint = new Map<string, number>();

    _globalBufferData: Float32Array = new Float32Array(16 * 4);
    _globalBuffer!: WebGLBuffer;

    _prepassShader!: Shader;
    _lightPassShader!: Shader;
    _batch!: Map<number, Map<number, Set<number>>>;
    _modelViewMatrices: Map<number, Matrix4> = new Map();
    _normalMatrices: Map<number, Matrix3> = new Map();

    _mvBuffer!: Float32Array;
    _nBuffer!: Float32Array;
    _lightBuffer!: Float32Array;

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [Transform, Material, Renderer] });
    }

    Init()
    {
        this._prepassShader = new Shader(prepassVert, prepassFrag);
        this._lightPassShader = new Shader(mainPassVert, mainPassFrag);

        view([Light], { name: PointLight.name, exec: light => light instanceof PointLight });
        view([Light], { name: DirectionalLight.name, exec: light => light instanceof DirectionalLight });
        view([Light], { name: AreaLight.name, exec: light => light instanceof AreaLight });

        const entities = view([Transform, Material, Renderer]).length
        this._mvBuffer = new Float32Array(entities * Matrix4.SIZE);
        this._nBuffer = new Float32Array(entities * Matrix3.SIZE);
        this._createBatch();
    }

    private _createBatch(): void
    {
        const map = new Map<number, Map<number, Set<number>>>();
        let offset = 0;

        for (const entityId of view([Transform, Material, Renderer]))
        {
            const material = getComponent(entityId, Material)!;
            const renderer = getComponent(entityId, Renderer)!;
            const transform = getComponent(entityId, Transform)!;

            const rendererMap = map.get(material.Id) ?? new Map<number, Set<number>>();
            const transformSet = rendererMap.get(renderer.Id) ?? new Set<number>();

            rendererMap.set(renderer.Id, new Set([...transformSet, transform.Id]));
            map.set(material.Id, rendererMap);

            const mv = new Matrix4(this._mvBuffer.buffer, Matrix4.BYTES_PER_ELEMENT * Matrix4.SIZE * offset).Identity();
            const n = new Matrix3(this._nBuffer.buffer, Matrix3.BYTES_PER_ELEMENT * Matrix3.SIZE * offset).Identity();
            offset++;

            this._modelViewMatrices.set(transform.Id, mv);
            this._normalMatrices.set(transform.Id, n);
        }

        this._batch = map;
    }

    Start() { }
    Stop() { }

    Update(_: number)
    {
        // foreach Window
        // Render Scene Data
        // Composite Windows together
        
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.depthMask(true);

        for (const window of this.Scene.Windows)
        {
            window.MainPass.Output.Bind();
            // GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            // GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
            // GL.clearColor(0, 0, 0, 0);
            // GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            this.prepassRender(window.Camera);
            // this.shdaowpassRender();
        }

        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        const dir = view([Light], DirectionalLight.name).map(id => getComponent(id, Light)).first as DirectionalLight;

        this._lightPassShader.Bind();
        // this._lightPassShader.SetBufferData('MyAreaLight', new Colour4(1,1,1,0.15));
        // this._lightPassShader.PushBufferData('MyAreaLight');
        for (let i = this.Scene.Windows.length - 1; i >= 0; --i)
        {
            const window = this.Scene.Windows[i];
            this._lightPassShader.Reset();
            
            this._lightPassShader.SetTexture(`U_Position`, window.FinalComposite.ColourAttachments[0]);
            this._lightPassShader.SetTexture(`U_Normal`, window.FinalComposite.ColourAttachments[1]);
            this._lightPassShader.SetTexture(`U_ColourSpecular`, window.FinalComposite.ColourAttachments[2]);
            this._lightPassShader.SetTexture(`U_Depth`, window.FinalComposite.DepthAttachment!);
            // this._lightPassShader.SetTexture(`U_Other[0]`, dir.RenderTarget.DepthAttachment!);
            // this._lightPassShader.SetMatrix(`U_OtherMatrix[0]`, dir.ShadowMatrix);
            // this._lightPassShader.SetTexture(`U_Other[1]`, dir.ShadowCascades[1].RenderTarget.ColourAttachments.first!);
            // this._lightPassShader.SetMatrix(`U_OtherMatrix[1]`, Matrix4.Multiply(dir.ShadowCascades[1].Projection!, dir.ModelMatrix));
            // this._lightPassShader.SetTexture(`U_Other[2]`, dir.ShadowCascades[2].RenderTarget.ColourAttachments.first!);
            // this._lightPassShader.SetMatrix(`U_OtherMatrix[2]`, Matrix4.Multiply(dir.ShadowCascades[2].Projection!, dir.ModelMatrix));
            this._lightPassShader.SetFloatVector('U_PanelOffset', window.Offset);
            this._lightPassShader.SetFloatVector('U_PanelScale', window.Scale);

            // this.bindLights();

            GL.bindVertexArray(window.Panel.VertexArrayBuffer);
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer);
            GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
            GL.bindVertexArray(null);
        }
        this._lightPassShader.UnBind();
    }

    private bindLights()
    {
        let a = 0;
        let d = 0;
        let p = 0;
        const shader = this._lightPassShader;

        for (const entityId of view([Light], AreaLight.name))
        {
            const light = getComponent(entityId, Light)! as AreaLight;

            shader.SetFloatVector(`U_AreaLight[${a}].Colour`, light.Colour);
            shader.SetFloat(`U_AreaLight[${a}].Intensity`, light.Intensity);

            a++;
        }

        for (const entityId of view([Light], DirectionalLight.name))
        {
            const light = getComponent(entityId, Light)! as DirectionalLight;
            const transform = getComponent(entityId, Transform);
            const rotx = transform?.GlobalRotation().X ?? 0;
            const roty = transform?.GlobalRotation().Y ?? 0;
            const rotz = transform?.GlobalRotation().Z ?? 0;

            const direction = Matrix3.MultiplyVector(
                Matrix3.RotationMatrix(-rotx + 90, -roty, rotz),
                0,0,1
            ).Normalize()

            shader.SetFloatVector(`U_DirectionalLight[${d}].Colour`, light.Colour);
            shader.SetFloat(`U_DirectionalLight[${d}].Intensity`, light.Intensity);

            shader.SetFloatVector(`U_DirectionalLight[${d}].Direction`, direction);
            shader.SetBool(`U_DirectionalLight[${d}].CastShadows`, light.CastShadows);

            shader.SetFloat(`U_DirectionalLight[${d}].TexelSize`, 1 / light.RenderTarget.Width);
            shader.SetFloat(`U_DirectionalLight[${d}].TexelCount`, ((light.PCFLevel * 2) + 1) ** 2);
            shader.SetFloat(`U_DirectionalLight[${d}].Bias`, light.Bias);
            shader.SetFloat(`U_DirectionalLight[${d}].PCFLevel`, light.PCFLevel);

            shader.SetMatrix(`U_DirectionalLight[${d}].ShadowMatrix`, light.ShadowMatrix);
            d++;
        }

        for (const entityId of view([Light], PointLight.name))
        {
            const light = getComponent(entityId, Light, PointLight)!
            const position = light.Owner?.GetComponent(Transform)?.GlobalPosition() ?? Vector3.Zero

            shader.SetFloatVector(`U_PointLight[${p}].Colour`, light.Colour)
            shader.SetFloat(`U_PointLight[${p}].Intensity`, light.Intensity)

            shader.SetFloatVector(`U_PointLight[${p}].Position`, position)
            shader.SetFloat(`U_PointLight[${p}].Radius`, light.Radius)

            p++
        }
    }

    private shdaowpassRender()
    {
        GL.disable(GL.CULL_FACE);
        for (const lightEntityId of view([Light], DirectionalLight.name))
        {
            const light = getComponent(lightEntityId, Light)! as DirectionalLight;
            if (!light.CastShadows)
            {
                continue;
            }

            light.BindForShadows();
            for (const cascade of light.ShadowCascades)
            {
                // const matrix = Matrix4.Multiply(cascade.Projection, light.ModelMatrix);

                // cascade.RenderTarget.Bind();
                // DirectionalLight.ShadowShader.SetMatrix('U_Matrix.Shadow', matrix);
                const shader = DirectionalLight.ShadowShader;
                for (const [materialId, renderers] of this._batch)
                {
                    const material = getComponentById(Material, materialId)!;
                    if (!material.ProjectsShadows)
                    {
                        continue;
                    }

                    for (const [rendererId, transforms] of renderers)
                    {
                        const renderer = getComponentById(Renderer, rendererId)!;
                        const mesh = renderer.Asset!;

                        let mode = -1;
                        let count = 0;
                        let buffer = null;

                        switch (renderer.RenderMode)
                        {
                            case RenderMode.FACE:
                                {
                                    mode = GL.TRIANGLES;
                                    count = mesh.FaceCount;

                                    if (mesh.IsIndexed)
                                    {
                                        buffer = mesh.FaceBuffer;
                                    }
                                }
                                break;

                            case RenderMode.EDGE:
                                {
                                    mode = GL.LINES;
                                    count = mesh.EdgeCount;

                                    if (mesh.IsIndexed)
                                    {
                                        buffer = mesh.EdgeBuffer;
                                        mode = GL.LINES;
                                    }
                                }
                                break;

                            case RenderMode.POINT:
                                {
                                    mode = GL.POINTS;
                                    count = mesh.PointCount;

                                    if (mesh.IsIndexed)
                                    {
                                        buffer = mesh.PointBuffer;
                                    }
                                }
                                break;
                        }

                        GL.bindVertexArray(mesh.VertexArrayBuffer);
                        for (const transformId of transforms)
                        {
                            const modelView = this._modelViewMatrices.get(transformId)!;
                            shader.SetMatrix('U_Matrix.ModelView', modelView, true);

                            if (buffer)
                            {
                                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
                                GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0);
                            }
                            else
                            {
                                GL.drawArrays(mode, 0, count);
                            }
                        }
                        GL.bindVertexArray(null);
                    }
                }
            }
        }
        DirectionalLight.ShadowShader.UnBind();
        GL.enable(GL.CULL_FACE);
    }

    private prepassRender(camera: Camera)
    {
        const projection = camera.ProjectionMatrix;
        const view = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity;

        this._prepassShader.Bind();
        this._prepassShader.SetMatrix('U_Matrix.View', view, true);
        this._prepassShader.SetMatrix('U_Matrix.Projection', projection, true);
        // this._prepassShader.SetBufferData('Camera', view.Transpose(), 0);
        // this._prepassShader.SetBufferData('Camera', projection.Transpose(), Matrix4.BYTES_PER_ELEMENT * Matrix4.SIZE);

        for (const [materialId, renderers] of this._batch)
        {
            const material = getComponentById(Material, materialId)!;
            material.Bind(this._prepassShader);
            this._prepassShader.Reset();

            for (const [rendererId, transforms] of renderers)
            {
                const renderer = getComponentById(Renderer, rendererId)!;
                const mesh = renderer.Asset!;

                let mode = -1;
                let count = 0;
                let buffer = null;

                switch (renderer.RenderMode)
                {
                    case RenderMode.FACE:
                        {
                            mode = GL.TRIANGLES;
                            count = mesh.FaceCount;

                            if (mesh.IsIndexed)
                            {
                                buffer = mesh.FaceBuffer;
                            }
                        }
                        break;

                    case RenderMode.EDGE:
                        {
                            mode = GL.LINES;
                            count = mesh.EdgeCount;

                            if (mesh.IsIndexed)
                            {
                                buffer = mesh.EdgeBuffer;
                                mode = GL.LINES;
                            }
                        }
                        break;

                    case RenderMode.POINT:
                        {
                            mode = GL.POINTS;
                            count = mesh.PointCount;

                            if (mesh.IsIndexed)
                            {
                                buffer = mesh.PointBuffer;
                            }
                        }
                        break;
                }

                GL.bindVertexArray(mesh.VertexArrayBuffer);
                for (const transformId of transforms)
                {
                    const transform = getComponentById(Transform, transformId)!;
                    const modelView = this._modelViewMatrices.get(transformId)!;
                    const normal = this._normalMatrices.get(transformId)!;

                    transform.ModelViewMatrix(modelView);
                    Matrix3.Inverse(modelView.Matrix3.Transpose(), normal);

                    this._prepassShader.SetMatrix('U_Matrix.ModelView', modelView, true);
                    this._prepassShader.SetMatrix('U_Matrix.Normal', normal, true);

                    if (buffer)
                    {
                        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
                        GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0);
                    }
                    else
                    {
                        GL.drawArrays(mode, 0, count);
                    }
                }
                GL.bindVertexArray(null);
            }
        }
    }
}

const prepassVert = `#version 300 es
#pragma vscode_glsllint_stage: vert
layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec3 A_Colour;

layout (std140) uniform;
precision highp float;

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
out Vertex V_Vertex;

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat3 Normal;
    mat4 Projection;
};
uniform Matrix U_Matrix;

// uniform Camera
// {
//     mat4 ViewMatrix;
//     mat4 ProjectionMatrix;
// } camera;

// uniform Globals
// {
//     mat4 ProjectionMatrix;
//     mat4 ViewMatrix;
//     mat4 ModelViewMatrix;
//     mat3 NormalMatrix;
// };

void main(void)
{
    vec4 position = U_Matrix.ModelView * vec4(A_Position, 1.0);

    V_Vertex.Position = position.xyz;
    V_Vertex.Normal = U_Matrix.Normal * A_Normal;
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour;

    // gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * position;
    gl_Position = U_Matrix.Projection * U_Matrix.View * position;
}
`;

const prepassFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag
precision highp float;

layout(location = 0) out vec3 O_Position;
layout(location = 1) out vec3 O_Normal;
layout(location = 2) out vec4 O_ColourSpecular;

// Position         Position            Position
// Normal           Normal              Normal
// Diffuse          Diffuse             Diffuse             Specular
// AmbientOcclusion AmbientOcclusion    AmbientOcclusion    RoughnessMetallic

struct Vertex
{
    vec3 Position;
    vec3 Normal;
    vec2 UV;
    vec3 Colour;
};
in Vertex V_Vertex;

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
    vec4 tex = texture(U_Sampler.Image, V_Vertex.UV);
    vec3 albedo = U_Material.Colour * tex.rgb * V_Vertex.Colour;
    float alpha = U_Material.Alpha * tex.a;

    O_Position = V_Vertex.Position;
    O_Normal = normalize(V_Vertex.Normal);
    O_ColourSpecular = vec4(albedo, alpha);
}
`;
const mainPassVert = `#version 300 es
#pragma vscode_glsllint_stage: vert

layout(location = 0) in vec2 A_Position;
out vec2 V_UV;

uniform vec2 U_PanelOffset;
uniform vec2 U_PanelScale;

void main(void)
{
    V_UV = A_Position * 0.5 + 0.5;
    gl_Position = vec4((A_Position * U_PanelScale) + U_PanelOffset, 0.0, 1.0);
}
`;

const mainPassFrag = `#version 300 es
#pragma vscode_glsllint_stage: frag
precision highp float;
layout (std140) uniform;

in vec2 V_UV;
layout(location = 0) out vec4 O_FragColour;

uniform sampler2D U_Position;
uniform sampler2D U_Normal;
uniform sampler2D U_ColourSpecular;
uniform sampler2D U_Depth;
uniform sampler2D[4] U_Other;
uniform mat4[4] U_OtherMatrix;

struct Fragment
{
    vec3 Position;
    vec3 Normal;
    vec3 Diffuse;
    float Specular;
    float Depth;
}   fragment;

struct AreaLight
{
    vec3 Colour;
    float Intensity;
};
uniform AreaLight[1] U_AreaLight;

uniform MyAreaLight
{
    AreaLight[1] areaLights;
};

vec3 CalcAreaLight(AreaLight light)
{
    return U_AreaLight[0].Colour * U_AreaLight[0].Intensity;
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

float ShadowWeightDirectional(DirectionalLight dir, float diffuseDot, sampler2D shadowSampler, mat4 shadowMatrix)
{
    vec4 shadowPosition = shadowMatrix * vec4(fragment.Position, 1.0);
    float bias = max(dir.Bias * (1.0 - diffuseDot), 0.0005);
    vec3 lightPosition = (shadowPosition.xyz / shadowPosition.w) * 0.5 + 0.5;
    vec2 fragUV = lightPosition.xy;
    float fragmentDepth = lightPosition.z;

    if (fragmentDepth > 1.0)
    {
        fragmentDepth = 1.0;
    }

    float total = 0.0;
    for (float x = -dir.PCFLevel; x <= dir.PCFLevel; ++x)
    {
        for (float y = -dir.PCFLevel; y <= dir.PCFLevel; ++y)
        {
            vec2 offset = vec2(x, y) * dir.TexelSize;
            vec2 uv = fragUV + offset;
            if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0)
            {
                continue;
            }

            float shadowDepth = texture(shadowSampler, fragUV).r + bias;
            if (shadowDepth < fragmentDepth)
            {
                total += 1.0;
            }
        }
    }

    return total / dir.TexelCount;
}

vec3 CalcDirectionalLight(DirectionalLight light)
{
    float val = dot(fragment.Normal, light.Direction);
    float diffuse = max(val, 0.0);
    float cascade = ShadowWeightDirectional(light, val, U_Other[0], light.ShadowMatrix); //U_OtherMatrix[0]);
    float shadow = 1.0 - cascade;

    // return light.Colour * diffuse * light.Intensity * shadow;
    return vec3(1.0);
}

struct PointLight
{
    vec3 Colour;
    float Intensity;

    vec3 Position;
    float Radius;
};
uniform PointLight[230] U_PointLight;

vec3 CalcPointLight(PointLight light)
{
    vec3 difference = light.Position - fragment.Position;
    vec3 direction = normalize(difference);
    vec3 eye = normalize(-fragment.Normal);
    vec3 reflection = reflect(direction, fragment.Normal);
    float len = length(difference);

    float diffuseWeight = max(0.0, dot(fragment.Normal, direction));
    float specularWeight = pow(max(0.0, dot(reflection, eye)), 32.0f);
    float attenuation = light.Radius / (len * len);

    vec3 diffuse = light.Colour * diffuseWeight * attenuation;
    vec3 specular = light.Colour * specularWeight * attenuation; // * fragment.Specular;

    // return (diffuse + specular) * light.Intensity;
    return vec3(1.0);
}

void main(void)
{
    fragment = Fragment(
        texture(U_Position, V_UV).rgb,
        texture(U_Normal, V_UV).rgb,
        texture(U_ColourSpecular, V_UV).rgb,
        texture(U_ColourSpecular, V_UV).a,
        texture(U_Depth, V_UV).r
    );

    vec3 lighting = vec3(1.0);

    // for (int i = 0; i < U_AreaLight.length(); ++i)
    // {
    //     lighting += CalcAreaLight(U_AreaLight[i]);
    // }

    // for (int i = 0; i < U_DirectionalLight.length(); ++i)
    // {
    //     lighting += CalcDirectionalLight(U_DirectionalLight[i]);
    // }

    // for (int i = 0; i < U_PointLight.length(); ++i)
    // {
    //     lighting += CalcPointLight(U_PointLight[i]);
    // }

    O_FragColour = vec4(lighting * fragment.Diffuse, 1.0);
    // O_FragColour = vec4(texture(U_Other[0], V_UV).rrr, 1.0);
    // O_FragColour = vec4(fragment.Normal, 1.0);
}
`;
