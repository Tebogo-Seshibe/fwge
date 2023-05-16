import { GL, Matrix3, Matrix4, Vector3 } from "@fwge/common";
import { Shader } from "../base";
import { AreaLight, BasicLitMaterial, Camera, DirectionalLight, Light, Material, PointLight, Renderer, RenderMode, Transform } from "../components";
import { Registry, System } from "../ecs";

export class DeferredRenderSystem extends System
{
    private readonly _pointLights = Symbol();
    private readonly _directionalLights = Symbol();
    private readonly _areaLights = Symbol();
    private readonly _renderables = Symbol();
    private readonly _renderableGroups = '_renderableGroups';

    _globalBufferData: Float32Array = new Float32Array(16 * 4);
    _globalBuffer!: WebGLBuffer;

    // _prepassShader!: Shader;
    _lightPassShader!: Shader;
    _batch!: Map<number, Map<number, Set<number>>>;
    _modelViewMatrices: Map<number, Matrix4> = new Map();
    _normalMatrices: Map<number, Matrix3> = new Map();

    _mvBuffer!: Float32Array;
    _nBuffer!: Float32Array;
    _lightBuffer!: Float32Array;

    Init()
    {
        // this._prepassShader = new Shader(prepassVert, prepassFrag);
        this._lightPassShader = new Shader(mainPassVert, mainPassFrag);
        console.log(this._lightPassShader);
        Registry.registerView(this._areaLights, [Light], [ light => light instanceof AreaLight]);
        Registry.registerView(this._directionalLights, [Light], [ light => light instanceof DirectionalLight]);
        Registry.registerView(this._pointLights, [Light], [ light => light instanceof PointLight]);
        Registry.registerView(this._renderables, [Transform, Material, Renderer]);
        Registry.registerGroup(this._renderableGroups, [Material, Renderer, Transform]);

        const entities = Registry.getView(this._renderables).length;
        this._mvBuffer = new Float32Array(entities * Matrix4.SIZE);
        this._nBuffer = new Float32Array(entities * Matrix3.SIZE);
        this._createBatch();
    }

    private _createBatch(): void
    {
        const map = new Map<number, Map<number, Set<number>>>();
        let offset = 0;

        for (const entityId of Registry.getView(this._renderables))
        {
            const material = Registry.getComponent(entityId, Material)!;
            const renderer = Registry.getComponent(entityId, Renderer)!;
            const transform = Registry.getComponent(entityId, Transform)!;

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
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.depthMask(true);

        for (const window of this.Scene.Windows)
        {
            window.MainPass.Output.Bind();
            this.prepassRender2(window.Camera);
            // this.shdaowpassRender();
        }
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        this._lightPassShader.Bind();
        this.bindLights();
        for (let i = this.Scene.Windows.length - 1; i >= 0; --i)
        {
            const window = this.Scene.Windows[i];
            // this._lightPassShader.Reset();
            
            this._lightPassShader.SetTexture(`U_Position`, window.FinalComposite.ColourAttachments[0]);
            this._lightPassShader.SetTexture(`U_Normal`, window.FinalComposite.ColourAttachments[1]);
            this._lightPassShader.SetTexture(`U_ColourSpecular`, window.FinalComposite.ColourAttachments[2]);
            this._lightPassShader.SetTexture(`U_Depth`, window.FinalComposite.DepthAttachment!);
            this._lightPassShader.SetFloatVector('U_PanelOffset', window.Offset);
            this._lightPassShader.SetFloatVector('U_PanelScale', window.Scale);

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

        for (const entityId of Registry.getView(this._areaLights))
        {
            const light = Registry.getComponent(entityId, Light)! as AreaLight;

            shader.SetFloatVector(`U_AreaLight[${a}].Colour`, light.Colour);
            shader.SetFloat(`U_AreaLight[${a}].Intensity`, light.Intensity);

            a++;
        }

        for (const entityId of Registry.getView(this._directionalLights))
        {
            const light = Registry.getComponent(entityId, DirectionalLight)!;
            const transform = Registry.getComponent(entityId, Transform);
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

        for (const entityId of Registry.getView(this._pointLights))
        {
            const light = Registry.getComponent(entityId, PointLight)!
            const position = light.Owner?.GetComponent(Transform)?.GlobalPosition() ?? Vector3.Zero

            shader.SetFloatVector(`U_PointLight[${p}].Colour`, light.Colour)
            shader.SetFloat(`U_PointLight[${p}].Intensity`, light.Intensity)

            shader.SetFloatVector(`U_PointLight[${p}].Position`, position)
            shader.SetFloat(`U_PointLight[${p}].Radius`, light.Radius)

            p++
        }
    }

    private prepassRender2(camera: Camera): void
    {
        const projection: Matrix4 = camera.ProjectionMatrix;
        const view: Matrix4 = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity;

        for (const [materialId, group] of Registry.getGroup<2>(this._renderableGroups))
        {
            const material = Registry.getComponentInstance(materialId, BasicLitMaterial)!;
            const shader = material.Shader;
            if (!shader)
            {
                continue;
            }

            shader.Bind();
            shader.SetBufferDataField('Camera', 'ViewMatrix', view, true);
            shader.SetBufferDataField('Camera', 'ProjectionMatrix', projection, true);
            shader.PushBufferData('Camera');
            material.BindBlock();

            for (const [rendererId, entities] of group)
            {
                const renderer = Registry.getComponentInstance(rendererId, Renderer)!;
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
                for (const entityId of entities)
                {
                    const transform = Registry.getComponent(entityId, Transform)!;
                    const modelView = this._modelViewMatrices.get(transform.Id) ?? Matrix4.Identity;
                    const normal = this._normalMatrices.get(transform.Id)! ?? Matrix3.Identity;
                    this._modelViewMatrices.set(transform.Id, modelView);
                    this._normalMatrices.set(transform.Id, normal);
                    
                    transform.ModelViewMatrix(modelView);
                    Matrix3.Inverse(modelView.Matrix3.Transpose(), normal);
                        
                    shader.SetBufferDataField('Object', 'ModelViewMatrix', modelView, true);
                    shader.SetBufferDataField('Object', 'NormalMatrix', normal, true);
                    shader.PushBufferData('Object');
        
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

            shader.UnBind();
        }
    }

    private prepassRender(camera: Camera)
    {
        const projection: Matrix4 = camera.ProjectionMatrix;
        const view: Matrix4 = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity;

        const shaderIndexMap: Map<Shader, number> = new Map();

        for (const entityId of Registry.getView(this._renderables))
        {
            const material = Registry.getComponent(entityId, BasicLitMaterial)!;
            const renderer = Registry.getComponent(entityId, Renderer)!;
            const transform = Registry.getComponent(entityId, Transform)!;
            const mesh = renderer.Asset!;
            const shader = material.Shader!;

            const modelView = this._modelViewMatrices.get(transform.Id)!;
            const normal = this._normalMatrices.get(transform.Id)!;

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

            if (!shaderIndexMap.has(shader))
            {
                shaderIndexMap.set(shader, 0);
            }
            const shaderIndex = shaderIndexMap.get(shader)!;

            shader.Bind(shaderIndex);
            shaderIndexMap.set(shader, shaderIndex + 1);
            shader.SetBufferDataField('Camera', 'ViewMatrix', view, true);
            shader.SetBufferDataField('Camera', 'ProjectionMatrix', projection, true);
            shader.PushBufferData('Camera');

            transform.ModelViewMatrix(modelView);
            // Matrix3.Inverse(modelView.Matrix3.Transpose(), normal);
                
            shader.SetBufferDataField('Object', 'ModelViewMatrix', modelView, true);
            shader.SetBufferDataField('Object', 'NormalMatrix', modelView.Matrix3, false);
            shader.PushBufferData('Object');
            material.BindBlock(shader);

            GL.bindVertexArray(mesh.VertexArrayBuffer);
            if (buffer)
            {
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
                GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0);
            }
            else
            {
                GL.drawArrays(mode, 0, count);
            }
            GL.bindVertexArray(null);
            shader.UnBind();
        }

        if (this.print)
        {
            console.log(shaderIndexMap);
            this.print = false;
        }
    }
    print = true;
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

uniform Object
{
    mat4 ModelViewMatrix;
    mat3 NormalMatrix;
} object;

uniform Camera
{
    mat4 ViewMatrix;
    mat4 ProjectionMatrix;
} camera;

void main(void)
{
    vec4 position = object.ModelViewMatrix * vec4(A_Position, 1.0);

    V_Vertex.Position = position.xyz;
    V_Vertex.Normal = object.NormalMatrix * A_Normal;
    V_Vertex.UV = A_UV;
    V_Vertex.Colour = A_Colour;

    gl_Position = camera.ProjectionMatrix * camera.ViewMatrix * position;
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


uniform BasicLitMaterial
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
} myMaterial;

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
    vec3 albedo = myMaterial.Colour * tex.rgb * V_Vertex.Colour;
    float alpha = myMaterial.Alpha * tex.a;

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

// uniform MyAreaLight
// {
//     AreaLight[1] areaLights;
// };

vec3 CalcAreaLight(AreaLight light)
{
    return light.Colour * light.Intensity;
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
    float cascade = 0.0; //ShadowWeightDirectional(light, val, U_Other[0], light.ShadowMatrix); //U_OtherMatrix[0]);
    float shadow = 1.0 - cascade;

    return light.Colour * diffuse * light.Intensity * shadow;
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

    return (diffuse + specular) * light.Intensity;
    // return vec3(1.0);
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

    vec3 lighting = vec3(0.0);

    for (int i = 0; i < U_AreaLight.length(); ++i)
    {
        lighting += CalcAreaLight(U_AreaLight[i]);
    }

    for (int i = 0; i < U_DirectionalLight.length(); ++i)
    {
        lighting += CalcDirectionalLight(U_DirectionalLight[i]);
    }

    for (int i = 0; i < U_PointLight.length(); ++i)
    {
        lighting += CalcPointLight(U_PointLight[i]);
    }

    O_FragColour = vec4(lighting * fragment.Diffuse, 1.0);
}
`;
