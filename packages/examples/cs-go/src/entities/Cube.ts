import { randBetween } from "@fwge/common"
import { FWGEComponent } from "@fwge/core"
import { IInputArgs, KeyState } from "@fwge/input"
import { Collider, SphereCollider } from "@fwge/physics"
import { Material, ShaderAsset, StaticMesh } from "@fwge/render"
import { GameObject } from "./GameObject"

export class Cube extends GameObject
{
    @FWGEComponent('Cube')
    public mesh!: StaticMesh

    @FWGEComponent()
    public material!: Material

    @FWGEComponent(new SphereCollider({ isTrigger: true, radius: 1 }))
    public collider!: Collider

    override OnCreate(): void
    {
        super.OnCreate()
        
        this.material = new Material({
            ambient: [1,1,1,1],
            shader: new ShaderAsset(
            {
                vertexShader:
                {
                    source: `#version 300 es
        
                    layout(location = 0) in vec4 A_Position;
                    layout(location = 1) in vec3 A_Normal;
                    layout(location = 2) in vec2 A_UV;
                    layout(location = 3) in vec4 A_Colour;
                    layout(location = 4) in mat4 A_ModelViewMatrix;
                    layout(location = 8) in mat3 A_NormalMatrix;
        
                    out vec4 V_Position;
                    out vec3 V_Normal;
                    out vec2 V_UV;
                    out vec4 V_Colour;
        
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
                        V_Normal = A_Normal;
                        V_UV = A_UV;
                        V_Colour = A_Colour;
                    }
                    
                    void main(void)
                    {
                        passVertexData();
                    
                        gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position;
                    }
                    `,
                    input: []
                },
                fragmentShader:
                {
                    source: `#version 300 es
                    precision highp float;
                    
                    in vec4 V_Position;
                    in vec3 V_Normal;
                    in vec2 V_UV;
                    in vec4 V_Colour;
                    
                    layout(location = 0) out vec4 O_FragColour;            
                                        
                    struct Material 
                    {
                        vec4 Ambient;
                        vec4 Diffuse;
                        vec4 Specular;
                        float Shininess;
                        float Alpha;
        
                        bool HasImageMap;
                        bool HasBumpMap;
                    };
        
                    uniform Material U_Material;
        
                    void main(void)
                    {
                        O_FragColour = vec4(U_Material.Ambient.rgb, U_Material.Alpha);
                    }
                    `,
                    input: []
                }
            })  
        }) //.Ambient.Set(0.3, 0.6, 0.9, 1.0)
        this.transform.Position.Set(randBetween(0,10) - 5, 0, randBetween(0,10) - 5)
    }
    
    override Update(delta: number)
    {
        this.transform.Rotation.Y += delta * 5
    }
    
    override Input({ Keyboard }: IInputArgs, delta: number): void
    {
        if (Keyboard.KeyLeft !== KeyState.UP)
        {
            this.transform.Position.Y += delta * 0.5
        }
        if (Keyboard.KeyRight !== KeyState.UP)
        {
            this.transform.Position.Y -= delta * 0.5
        }
    } 
}
