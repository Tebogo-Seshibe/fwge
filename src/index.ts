let fwge: any = (<any>window)

// Animation
fwge.Animation = require('./Animation/Animation').default
fwge.AnimationFrame = require('./Animation/AnimationFrame').AnimationFrame

// Camera
fwge.Camera = require('./Camera/Camera').default
fwge.Viewer = require('./Camera/Viewer').default

// Input
// fwge.Controller = require('./Input/Controller').default
fwge.InputState = require('./Input/InputState').default
fwge.MouseInput = require('./Input/MouseInput').default
fwge.KeyboardInput = require('./Input/KeyboardInput').default

// Interfaces
fwge.Attachable = require('./Interfaces/Attachable').default 
fwge.Cloneable = require('./Interfaces/Cloneable').default
fwge.Destroyable = require('./Interfaces/Destroyable').default
fwge.Updateable = require('./Interfaces/Updateable').default

// Light
fwge.AmbientLight = require('./Light/AmbientLight').default 
fwge.DirectionalLight = require('./Light/DirectionalLight').default 
fwge.Light = require('./Light/Light').default
fwge.PointLight = require('./Light/PointLight').default

// Maths
fwge.Maths = require('./Maths/Maths').default
fwge.Vector2 = require('./Maths/Vector2').default
fwge.Vector3 = require('./Maths/Vector3').default
fwge.Vector4 = require('./Maths/Vector4').default
fwge.Matrix2 = require('./Maths/Matrix2').default
fwge.Matrix3 = require('./Maths/Matrix3').default
fwge.Matrix4 = require('./Maths/Matrix4').default

// Physics
// Physics Coliison
fwge.BoxCollider = require('./Physics/Collision/BoxCollider').default
fwge.Collider = require('./Physics/Collision/Collider').default
fwge.SphereCollider = require('./Physics/Collision/SphereCollider').default
fwge.CollisionEvent = require('./Physics/Collision/CollisionEvent').default
fwge.PhysicsBody = require('./Physics/PhysicsBody').default
fwge.PhysicsMaterial = require('./Physics/PhysicsMaterial').default

// Render
fwge.Colour4 = require('./Render/Colour4').default
fwge.Mesh = require('./Render/Mesh').default
fwge.Projection = require('./Render/Projection').default
fwge.ModelView = require('./Render/ModelView').default
fwge.Renderer = require('./Render/Renderer').default
fwge.RenderMaterial = require('./Render/RenderMaterial').default

// Shader
fwge.Shader = require('./Shader/Shader').default

// Utility
// Converter
fwge.OBJConverter = require('./Utility/Converter/OBJConverter').default
fwge.ArrayUtils = require('./Utility/ArrayUtils').default
fwge.BinaryTree = require('./Utility/BinaryTree').default
fwge.Control = require('./Utility/Control').default
fwge.FWGEEvent = require('./Utility/FWGEEvent').default
fwge.List = require('./Utility/List').default
fwge.ListUtils = require('./Utility/ListUtils').default
fwge.Time = require('./Utility/Time').default
fwge.Tree = require('./Utility/Tree').default

fwge.FWGE = require('./FWGE').default
fwge.GameObject = require('./GameObject').default
fwge.ParticleSystem = require('./ParticleSystem').default
fwge.Transform = require('./Transform').default