"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./Animation/index");
const index_2 = require("./Camera/index");
const index_3 = require("./Converter/index");
const index_4 = require("./Input/index");
const index_5 = require("./Light/index");
const LogicEngine_1 = __importDefault(require("./Engine/LogicEngine"));
const index_6 = require("./Maths/index");
const index_7 = require("./Object/index");
const index_8 = require("./Utility/index");
const PhysicsEngine_1 = __importDefault(require("./Engine/PhysicsEngine"));
const index_9 = require("./Render/index");
const RenderEngine_1 = __importDefault(require("./Engine/RenderEngine"));
const index_10 = require("./Physics/Collision/index");
const Math_1 = require("./Maths/Math");
let height = 1080;
let width = 1920;
let renderUpdate = 60;
let physicsUpdate = 60;
let animationFrame = -1;
exports.names = new Map();
exports.tags = new Map();
exports.GL = undefined;
class FWGE {
    constructor() {
        //#region Components
        this.Animation = index_1.Animation;
        this.AnimationFrame = index_1.AnimationFrame;
        this.Camera = index_2.Camera;
        this.OBJConverter = new index_3.OBJConverter;
        this.Input = new index_4.Input;
        this.ButtonState = index_4.ButtonState;
        this.KeyboardState = index_4.KeyboardState;
        this.WheelState = index_4.WheelState;
        this.AmbientLight = index_5.AmbientLight;
        this.DirectionalLight = index_5.DirectionalLight;
        this.PointLight = index_5.PointLight;
        this.ShadowQuality = index_5.ShadowQuality;
        this.Equations = index_6.Equations;
        this.Matrix2 = index_6.Matrix2;
        this.Matrix3 = index_6.Matrix3;
        this.Matrix4 = index_6.Matrix4;
        this.Vector2 = index_6.Vector2;
        this.Vector3 = index_6.Vector3;
        this.Vector4 = index_6.Vector4;
        this.GameObject = index_7.GameObject;
        this.Material = index_7.Material;
        this.Mesh = index_7.Mesh;
        this.RigidBody = index_7.RigidBody;
        this.Transform = index_7.Transform;
        this.ArrayUtils = index_8.ArrayUtils;
        this.BinaryTree = index_8.BinaryTree;
        this.List = index_8.List;
        this.ListUtils = index_8.ListUtils;
        this.Stack = index_8.Stack;
        this.Time = new index_8.Time;
        this.Tree = index_8.Tree;
        this.Colour3 = index_9.Colour3;
        this.Colour4 = index_9.Colour4;
        this.Shader = index_9.Shader;
        this.CircleCollider = index_10.CircleCollider;
        this.CubeCollider = index_10.CubeCollider;
        this.PhysicsMaterial = index_10.PhysicsMaterial;
        this.SphereCollider = index_10.SphereCollider;
        this.SquareCollider = index_10.SquareCollider;
        //#endregion
        //#region Engines
        this.RenderEngine = new RenderEngine_1.default;
        this.LogicEngine = new LogicEngine_1.default;
        this.PhysicsEngine = new PhysicsEngine_1.default;
        //#endregion
    }
    //#endregion
    //#region Public Properties
    get Height() {
        return height;
    }
    set Height(height) {
        height = Math_1.clamp(height, 0, Number.MAX_SAFE_INTEGER);
    }
    get Width() {
        return width;
    }
    set Width(width) {
        width = Math_1.clamp(width, 0, Number.MAX_SAFE_INTEGER);
    }
    get RenderUpdate() {
        return renderUpdate;
    }
    set RenderUpdate(renderUpdate) {
        renderUpdate = Math_1.clamp(renderUpdate, 0, Number.MAX_SAFE_INTEGER);
        this.Time.Init(renderUpdate, physicsUpdate);
    }
    get PhysicsUpdate() {
        return physicsUpdate;
    }
    set PhysicsUpdate(physicsUpdate) {
        physicsUpdate = Math_1.clamp(physicsUpdate, 0, Number.MAX_SAFE_INTEGER);
        this.Time.Init(physicsUpdate, physicsUpdate);
    }
    get GL() {
        return exports.GL;
    }
    //#endregion
    //#region Main Methods
    Init({ canvas, render = 60, physics = 60, clear = [0, 0, 0, 1], height = 1080, width = 1920 }) {
        exports.GL = canvas.getContext('webgl');
        if (exports.GL === undefined || exports.GL === null) {
            return false;
        }
        exports.GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        this.Input.Init(canvas);
        this.Time.Init(render, physics);
        this.Height = canvas.height = height;
        this.Width = canvas.width = width;
        this.LogicEngine.Init();
        this.PhysicsEngine.Init();
        this.RenderEngine.Init(exports.GL);
        return true;
    }
    Start() {
        if (animationFrame !== -1) {
            window.cancelAnimationFrame(animationFrame);
        }
        this.LogicEngine.Reset();
        this.PhysicsEngine.Reset();
        this.RenderEngine.Reset();
        this.Update();
    }
    Stop() {
        if (animationFrame !== -1) {
            window.cancelAnimationFrame(animationFrame);
        }
    }
    Update() {
        animationFrame = window.requestAnimationFrame(() => this.Update());
        this.Time.Update();
        this.LogicEngine.Update(this.Time.Render);
        this.PhysicsEngine.Update(this.Time.Physics);
        this.RenderEngine.Update();
    }
}
exports.default = FWGE;
//# sourceMappingURL=FWGE.js.map