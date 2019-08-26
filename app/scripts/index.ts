// Animation
import Animation, { IAnimation } from "../../src/Animation/Animation"

// Camera
import Camera, { ICamera } from '../../src/Camera/Camera'
import Viewer, { ViewMode } from '../../src/Camera/Viewer'

// Input
import Input from '../../src/Input/Input'
import ControllerInput from '../../src/Input/ControllerInput'
import MouseInput from '../../src/Input/MouseInput'
import KeyboardInput from '../../src/Input/KeyboardInput'
import { KeyboardState, ButtonState, WheelState } from '../../src/Input/InputState'

// Interfaces
import Attachable from '../../src/Interfaces/Attachable' 
import Cloneable from '../../src/Interfaces/Cloneable'
import Destroyable from '../../src/Interfaces/Destroyable'
import Updateable from '../../src/Interfaces/Updateable'

// Light
import AmbientLight, { IAmbientLight }  from '../../src/Light/AmbientLight' 
import DirectionalLight, { IDirectionalLight }  from '../../src/Light/DirectionalLight' 
import Light, { ILightItem }  from '../../src/Light/LightItem'
import PointLight, { IPointLight }  from '../../src/Light/PointLight'

// Maths
import Maths from '../../src/Maths/Maths'
import Vector2 from '../../src/Maths/Vector2'
import Vector3 from '../../src/Maths/Vector3'
import Vector4 from '../../src/Maths/Vector4'
import Matrix2 from '../../src/Maths/Matrix2'
import Matrix3 from '../../src/Maths/Matrix3'
import Matrix4 from '../../src/Maths/Matrix4'

// Physics
// Physics Coliison
import BoxCollider from '../../src/Physics/Collision/BoxCollider'
import Collider from '../../src/Physics/Collision/Collider'
import SphereCollider from '../../src/Physics/Collision/SphereCollider'
import CollisionEvent from '../../src/Physics/Collision/CollisionEvent'
import PhysicsBody from '../../src/Physics/PhysicsBody'
import PhysicsMaterial from '../../src/Physics/PhysicsMaterial'

// Render
import Colour4 from '../../src/Render/Colour4'
import Mesh from '../../src/Render/Mesh'
import Projection from '../../src/Render/Projection'
import ModelView from '../../src/Render/ModelView'
import RenderMaterial from '../../src/Render/RenderMaterial'

// // Shader
import Shader, { IShader }  from '../../src/Shader/Shader'

// Utility
// Converter
import OBJConverter from '../../src/Utility/Converter/OBJConverter'
import ArrayUtils from '../../src/Utility/ArrayUtils'
import BinaryTree from '../../src/Utility/BinaryTree'
import Control from '../../src/Utility/Control'
import FWGEEvent from '../../src/Utility/FWGEEvent'
import List from '../../src/Utility/List'
import ListUtils from '../../src/Utility/ListUtils'
import Stack from '../../src/Utility/Stack'
import Time from '../../src/Utility/Time'
import Tree from '../../src/Utility/Tree'

import FWGE from '../../src/FWGE'
import GameObject from '../../src/GameObject'
import ParticleSystem from '../../src/ParticleSystem'
import Transform from '../../src/Transform'

import '../../'

let fwge = <any>window
fwge.Control = Control
fwge.Camera = Camera
fwge.FWGE = FWGE
fwge.List = List
fwge.Input = Input
fwge.lights = { }
fwge.object = undefined

// fwge.VertexShader = VertexShader
// fwge.FragmentShader = FragmentShader

// fwge.Var = Var
// fwge.Unary = Unary
// fwge.Binary = Binary

window.onload = () =>
{
    let canvas = <HTMLCanvasElement>document.getElementById('canvas')

    // FWGE.Init(
    // {
    //     canvas,
    //     clear: [0, 0, 0, 0],
    //     physcisupdate: 30,
    //     renderupdate: 75
    // })
    
    // makeCube()
    //makeShader()
    // fwge.light = new AmbientLight(
    // {
    //     colour: [1, 1, 1, 1],
    //     intensity: 1.0,
    //     name: 'Ambient'
    //     // angle: 180,
    //     // position: [0,0,0],
    //     // radius: 5,
    //     // shininess: 32
    // })
}

async function makeCube()
{    
    let obj = await (await fetch('/res/Objects/Cube/Cube.obj')).text()
    let mtl = await (await fetch('/res/Objects/Cube/Cube.mtl')).text()

    let shader = new Shader(
    {
        name: 'Just another shader',
        vertexshader: `#version 300 es
            in vec3 A_Position;
            in vec2 A_UV;
            in vec4 A_Colour;
            in vec3 A_Normal;
            
            uniform mat3 U_MatrixNormal;
            uniform mat4 U_MatrixModelView;
            uniform mat4 U_MatrixProjection;
            
            out vec4 V_Position;
            out vec2 V_UV;
            out vec3 V_Normal;
            out vec4 V_Colour;
            out vec4 V_Shadow;
            
            void main(void)
            {
                V_Colour = A_Colour;
                V_UV = A_UV;
                
                V_Position = U_MatrixModelView * vec4(A_Position, 1.0);
                V_Normal = U_MatrixNormal * A_Normal;
                
                V_Shadow = mat4(0.5, 0.0, 0.0, 0.0,
                                0.0, 0.5, 0.0, 0.0,
                                0.0, 0.0, 0.5, 0.0,
                                0.5, 0.5, 0.5, 1.0) * vec4(A_Position, 1.0);
                
                gl_Position = U_MatrixProjection * V_Position;
            }`,
        fragmentshader: `#version 300 es
            precision mediump float;
            const int MAX_LIGHTS = 8;
            
            uniform vec4 U_MaterialAmbient;
            uniform vec4 U_MaterialDiffuse;
            uniform vec4 U_MaterialSpecular;
            uniform float U_MaterialShininess;
            uniform float U_MaterialAlpha;
            uniform bool U_MaterialHasImage;
            uniform bool U_MaterialHasBump;
            uniform bool U_MaterialHasSpecular;
            
            uniform vec4 U_AmbientColour;
            uniform float U_AmbientIntensity;
            
            uniform vec3 U_DirectionalDirection;
            uniform vec4 U_DirectionalColour;
            uniform float U_DirectionalIntensity;
            
            struct PointLight
            { 
                vec3 Position;
                vec4 Colour;
                float Intensity;
                float Radius;
                float Angle;
            };
            uniform PointLight U_Point[MAX_LIGHTS];
            uniform int U_Point_Count;
            
            /*uniform gsampler2D U_SamplerImage;
            uniform gsampler2D U_SamplerBump;
            uniform gsampler2D U_SamplerShadow;*/
            
            in vec4 V_Colour;
            in vec2 V_UV;
            in vec3 V_Normal;
            in vec4 V_Position;
            in vec4 V_Shadow;

            out vec4 FragColour;
            
            vec4 Ambient()
            {
                return U_MaterialAmbient * U_AmbientColour * U_AmbientIntensity;
            }
            
            vec4 Directional(in vec3 normal) 
            { 
                float weight = max(dot(normal, normalize(U_DirectionalDirection)), 0.0);
                vec4 diffuse = U_DirectionalColour * weight;
                
                return U_MaterialDiffuse * diffuse * U_DirectionalIntensity;
            } 
            
            vec4 Point(in vec3 normal)
            {
                vec4 points = vec4(0.0);
            
                for (int i = 0; i < MAX_LIGHTS; ++i)
                {
                    if (i < U_Point_Count)
                    {
                        PointLight point = U_Point[i];
                        float distance = length(point.Position - V_Position.xyz);
            
                        if (distance <= point.Radius)
                        {
                            vec4 colour = vec4(0.0);
                            vec3 direction = normalize(point.Position - V_Position.xyz);
                            vec3 eyeVector = normalize(-normal.xyz);
                            vec3 reflection = reflect(direction, normal);
                            
                            float diffuse_weight = max(dot(normal, direction), 0.0);
                            float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_MaterialShininess);
            
                            colour = U_MaterialDiffuse * point.Colour * diffuse_weight + U_MaterialSpecular * specular_weight;
                            colour = colour * (1.0 - (distance / point.Radius));
                            colour = colour * point.Intensity;
                            points += colour;
                        } 
                    } 
                    else break;
                } 
                
                return points;
            }
            
            vec4 Light()
            {
                vec3 normal = /*normalize(U_MaterialHasBump
                                        ? texture2D(U_SamplerBump, V_UV).xyz * V_Normal
                                        :*/ (V_Normal);
            
                return Ambient() + Directional(normal) + Point(normal);
            }
            
            vec4 Shadow()
            {                
                return vec4(1.0);
            }
            
            vec4 Colour()
            {
                vec4 colour = Shadow();
                
                /*if (U_MaterialHasImage)
                {
                    colour = texture2D(U_SamplerImage, V_UV);
                }*/
                
                return colour;
            }
            
            void main(void)
            { 
                vec4 colour = Colour() * Light();
                colour.a *= U_MaterialAlpha;
                
                FragColour = colour;
            }`,
        height: 1920,
        width: 1080
    })
    let object = <GameObject>fwge.object
    object = OBJConverter.Parse(obj, mtl)
    object.Material.Shader = shader
    object.Material.Ambient = new Colour4(1,1,1,1)
    object.Transform.Position.Z = -15
    object.Update = function(this: GameObject): void 
    {
        this.Transform.Rotation.Y += Time.Render.Delta * 0.1
    }
    
    Control.Start()
}

async function makeShader()
{
    /**
    new ShaderNode(new ShaderVec4('colour', [0,0,0,0]),
    [
        new ShaderNode(new ShaderFloat('red', 1), null), // red
        new ShaderNode(new ShaderFloat('green', 1), null), // green
        new ShaderNode(new ShaderFloat('blue', 1), null) // blue
    ])
    */
}