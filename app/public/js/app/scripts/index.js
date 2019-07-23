var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Animation from '../../src/Animation/Animation';
import AnimationFrame from '../../src/Animation/AnimationFrame';
import FWGE from '../../src/FWGE';
import Control from '../../src/Utility/Control';
import OBJConverter from '../../src/Utility/Converter/OBJConverter';
import Shader from '../../src/Shader/Shader';
import Time from '../../src/Utility/Time';
import Camera from '../../src/Camera/Camera';
import Transform from '../../src/Transform';
import List from '../../src/Utility/List';
let fwge = window;
fwge.Control = Control;
fwge.Camera = Camera;
fwge.FWGE = FWGE;
fwge.List = List;
window.onload = () => {
    let canvas = document.getElementById('canvas');
    FWGE.Init({
        canvas,
        clear: [0, 0, 0, 0],
        physcisupdate: 30,
        renderupdate: 75
    });
    fwge.numbers = new List();
};
function makeCube() {
    return __awaiter(this, void 0, void 0, function* () {
        let obj = yield (yield fetch('/res/Objects/Cube/Cube.obj')).text();
        let mtl = yield (yield fetch('/res/Objects/Cube/Cube.mtl')).text();
        let system;
        let shader = new Shader({
            name: 'Just another shader',
            vertexshader: `
            attribute vec3 A_Position;
            attribute vec2 A_UV;
            attribute vec4 A_Colour;
            attribute vec3 A_Normal;
            
            struct Matrix
            {
                mat3 Normal;
                mat4 ModelView;
                mat4 Projection;
            };
            uniform Matrix U_Matrix;
            
            varying vec4 V_Position;
            varying vec2 V_UV;
            varying vec3 V_Normal;
            varying vec4 V_Colour;
            varying vec4 V_Shadow;
            
            void main(void)
            {
                V_Colour = A_Colour;
                V_UV = A_UV;
                
                V_Position = U_Matrix.ModelView * vec4(A_Position, 1.0);
                V_Normal = U_Matrix.Normal * A_Normal;
                
                V_Shadow = mat4(0.5, 0.0, 0.0, 0.0,
                                0.0, 0.5, 0.0, 0.0,
                                0.0, 0.0, 0.5, 0.0,
                                0.5, 0.5, 0.5, 1.0) * vec4(A_Position, 1.0);
                
                gl_Position = U_Matrix.Projection * V_Position;
            }`,
            fragmentshader: `            
            precision mediump float;
            const int MAX_LIGHTS = 8;
            
            struct Material 
            {
                vec4 Ambient;
                vec4 Diffuse;
                vec4 Specular;
                float Shininess;
                float Alpha;
                bool HasImage;
                bool HasBump;
                bool HasSpecular;
            };
            uniform Material U_Material;
            
            struct AmbientLight 
            {
                vec4 Colour;
                float Intensity;
            };
            uniform AmbientLight U_Ambient;
            
            struct DirectionalLight
            {
                vec3 Direction;
                vec4 Colour;
                float Intensity;
            };
            uniform DirectionalLight U_Directional;
            
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
            
            struct Sampler
            {
                sampler2D Image;
                sampler2D Bump;
                sampler2D Shadow;
            };
            uniform Sampler U_Sampler;
            
            varying vec4 V_Colour;
            varying vec2 V_UV;
            varying vec3 V_Normal;
            varying vec4 V_Position;
            varying vec4 V_Shadow;
            
            vec4 Ambient()
            {
                return U_Material.Ambient * U_Ambient.Colour * U_Ambient.Intensity;
            }
            
            vec4 Directional(in vec3 normal) 
            { 
                float weight = max(dot(normal, normalize(U_Directional.Direction)), 0.0);
                vec4 diffuse = U_Directional.Colour * weight;
                
                return U_Material.Diffuse * diffuse * U_Directional.Intensity;
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
                            float specular_weight = pow(max(dot(reflection, eyeVector), 0.0), U_Material.Shininess);
            
                            colour = U_Material.Diffuse * point.Colour * diffuse_weight + U_Material.Specular * specular_weight;
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
                vec3 normal = normalize(U_Material.HasBump
                                        ? texture2D(U_Sampler.Bump, V_UV).xyz * V_Normal
                                        : V_Normal);
            
                return Ambient() + Directional(normal) + Point(normal);
            }
            
            vec4 Shadow()
            {                
                return vec4(1.0);
            }
            
            vec4 Colour()
            {
                vec4 colour = Shadow();
                
                if (U_Material.HasImage)
                {
                    colour = texture2D(U_Sampler.Image, V_UV);
                }
                
                return colour;
            }
            
            void main(void)
            { 
                vec4 colour = Colour();
                colour.a *= U_Material.Alpha;
                
                gl_FragColor = colour;
            }`,
            height: 1920,
            width: 1080
        });
        fwge.object = OBJConverter.Parse(obj, mtl);
        fwge.object.Material.Shader = shader;
        fwge.object.Transform.Position.Z = -5;
        fwge.object.Update = () => fwge.object.Transform.Rotation.Y += Time.Render.Delta * 0.01;
        fwge.animation = new Animation({
            name: 'Example',
            length: 5,
            gameObject: fwge.object,
            frames: [
                new AnimationFrame({
                    time: 0,
                    value: new Transform({ position: [0, 0, -5] })
                }),
                new AnimationFrame({
                    time: 1,
                    value: new Transform({ position: [1, 0, -5] })
                }),
                new AnimationFrame({
                    time: 2,
                    value: new Transform({ position: [1, 1, -5] })
                }),
                new AnimationFrame({
                    time: 2,
                    value: new Transform({ position: [0, 1, -5] })
                })
            ]
        });
        Control.Start();
        setTimeout(Control.Stop, 500);
    });
}
//# sourceMappingURL=index.js.map