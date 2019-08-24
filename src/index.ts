// Animation


export namespace global
{
    // Animation
    let [ Animation, { IAnimation }] = require('./Animation/Animation')
	let [ AnimationFrame, { IAnimationFrame }] = require('./Animation/AnimationFrame').AnimationFrame

    // Camera
	let [ Camera, { ICamera }] = require('./Camera/Camera')
	let [ Viewer, { ViewMode }] = require('./Camera/Viewer')

    // Input
    let Input = require('./Input/Input')
    let ControllerInput = require('./Input/ControllerInput')
	let MouseInput = require('./Input/MouseInput')
	let KeyboardInput = require('./Input/KeyboardInput')
    let { KeyboardState, ButtonState, WheelState } = require('./Input/InputState')

    // Interfaces
	let Attachable = require('./Interfaces/Attachable') 
	let Cloneable = require('./Interfaces/Cloneable')
	let Destroyable = require('./Interfaces/Destroyable')
	let Updateable = require('./Interfaces/Updateable')

    // // Light
	let [ AmbientLight, { IAmbientLight } ] = require('./Light/AmbientLight') 
	let [ DirectionalLight, { IDirectionalLight } ] = require('./Light/DirectionalLight') 
	let [ Light, { ILightItem } ] = require('./Light/LightItem')
	let [ PointLight, { IPointLight } ] = require('./Light/PointLight')

    // // Maths
	let Maths = require('./Maths/Maths')
	let Vector2 = require('./Maths/Vector2')
	let Vector3 = require('./Maths/Vector3')
	let Vector4 = require('./Maths/Vector4')
	let Matrix2 = require('./Maths/Matrix2')
	let Matrix3 = require('./Maths/Matrix3')
	let Matrix4 = require('./Maths/Matrix4')

    // // Physics
    // // Physics Coliison
	// let BoxCollider = require('./Physics/Collision/BoxCollider')
	// let Collider = require('./Physics/Collision/Collider')
	// let SphereCollider = require('./Physics/Collision/SphereCollider')
	// let CollisionEvent = require('./Physics/Collision/CollisionEvent')
	// let PhysicsBody = require('./Physics/PhysicsBody')
	// let PhysicsMaterial = require('./Physics/PhysicsMaterial')

    // // Render
	// let Colour4 = require('./Render/Colour4')
	// let Mesh = require('./Render/Mesh')
	// let Projection = require('./Render/Projection')
	// let ModelView = require('./Render/ModelView')
	// let Renderer = require('./Render/Renderer')
	// let RenderMaterial = require('./Render/RenderMaterial')

    // // Shader
	let [ Shader, { IShader } ] = require('./Shader/Shader')

    // // Utility
    // // Converter
	let OBJConverter = require('./Utility/Converter/OBJConverter')
	let ArrayUtils = require('./Utility/ArrayUtils')
	let BinaryTree = require('./Utility/BinaryTree')
	let Control = require('./Utility/Control')
	let FWGEEvent = require('./Utility/FWGEEvent')
	let List = require('./Utility/List')
	let ListUtils = require('./Utility/ListUtils')
	let Stack = require('./Utility/Stack')
	let Time = require('./Utility/Time')
	let Tree = require('./Utility/Tree')

	// let FWGE = require('./FWGE')
	// let GameObject = require('./GameObject')
	// let ParticleSystem = require('./ParticleSystem')
	// let Transform = require('./Transform')
}