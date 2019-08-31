export {}

declare global
{
	interface Window
	{
		FWGE: any
	}

	interface FWGE
	{
		Animation: any
		IAnimation: any

		Camera: any
		ICamera: any
		Viewer: any
		ViewMode: any

		Input: any
		ControllerInput: any
		MouseInput: any
		KeyboardInput: any
		KeyboardState: any
		ButtonState: any
		WheelState: any
		
		Attachable: any
		Cloneable: any
		Destroyable: any
		Updateable: any
		
		AmbientLight: any
		IAmbientLight: any
		DirectionalLight: any
		IDirectionalLight: any
		ILightItem: any
		PointLight: any
		IPointLight: any
		
		Maths: any
		Vector2: any
		Vector3: any
		Vector4: any
		Matrix2: any
		Matrix3: any
		Matrix4: any
		
		BoxCollider:any
		Collider: any
		SphereCollider: any
		CollisionEvent: any
		PhysicsBody: any
		PhysicsMaterial: any
		
		Colour4: any
		Mesh: any
		Projection: any
		ModelView: any
		RenderMaterial: any
		Shader: any
		IShader: any
		
		OBJConverter: any
		ArrayUtils: any
		BinaryTree: any
		Control: any
		FWGEEvent: any
		List: any
		ListUtils: any
		Stack: any
		Time: any
		Tree: any
		
		FWGE: any
		GameObject: any
		ParticleSystem: any
		Transform: any
	}
}

window.FWGE = {}

// Animation
window.FWGE.Animation = require('./Animation/Animation').default
window.FWGE.IAnimation = require('./Animation/Animation').IAnimation

// Camera
window.FWGE.Camera = require('./Camera/Camera').default
window.FWGE.ICamera = require('./Camera/Camera').ICamera
window.FWGE.Viewer = require('./Camera/Viewer').default
window.FWGE.ViewMode = require('./Camera/Viewer').ViewMode

// Input
window.FWGE.Input = require('./Input/Input').default
window.FWGE.KeyboardInput = require('./Input/KeyboardInput').default
window.FWGE.KeyboardState = require('./Input/InputState').KeyboardState
window.FWGE.ButtonState = require('./Input/InputState').ButtonState
window.FWGE.WheelState = require('./Input/InputState').WheelState

// Interfaces
window.FWGE.Attachable = require('./Interfaces/Attachable').default
window.FWGE.Cloneable = require('./Interfaces/Cloneable').default
window.FWGE.Destroyable = require('./Interfaces/Destroyable').default
window.FWGE.Updateable = require('./Interfaces/Updateable').default

// // Light
window.FWGE.AmbientLight = require('./Light/AmbientLight').default
window.FWGE.IAmbientLight = require('./Light/AmbientLight').IAmbientLight
window.FWGE.DirectionalLight = require('./Light/DirectionalLight').default
window.FWGE.IDirectionalLight = require('./Light/DirectionalLight').IDirectionalLight
window.FWGE.ILightItem = require('./Light/LightItem').ILightItem
window.FWGE.PointLight = require('./Light/PointLight').default
window.FWGE.IPointLight = require('./Light/PointLight').IPointLight

// // Maths
window.FWGE.Maths = require('./Maths/Maths').default
window.FWGE.Vector2 = require('./Maths/Vector2').default
window.FWGE.Vector3 = require('./Maths/Vector3').default
window.FWGE.Vector4 = require('./Maths/Vector4').default
window.FWGE.Matrix2 = require('./Maths/Matrix2').default
window.FWGE.Matrix3 = require('./Maths/Matrix3').default
window.FWGE.Matrix4 = require('./Maths/Matrix4').default

// Physics
// Physics Coliison
window.FWGE.BoxCollider = require('./Physics/Collision/BoxCollider').default
window.FWGE.Collider = require('./Physics/Collision/Collider').default
window.FWGE.SphereCollider = require('./Physics/Collision/SphereCollider').default
window.FWGE.CollisionEvent = require('./Physics/Collision/CollisionEvent').default
window.FWGE.PhysicsBody = require('./Physics/PhysicsBody').default
window.FWGE.PhysicsMaterial = require('./Physics/PhysicsMaterial').default

// Render
window.FWGE.Colour4 = require('./Render/Colour4').default
window.FWGE.Mesh = require('./Render/Mesh').default
window.FWGE.Projection = require('./Render/Projection').default
window.FWGE.ModelView = require('./Render/ModelView').default
window.FWGE.RenderMaterial = require('./Render/RenderMaterial').default

// Shader
window.FWGE.Shader = require('./Shader/Shader').default
window.FWGE.IShader = require('./Shader/Shader').IShader

// Utility
// Converter
window.FWGE.OBJConverter = require('./Utility/Converter/OBJConverter').default
window.FWGE.ArrayUtils = require('./Utility/ArrayUtils').default
window.FWGE.BinaryTree = require('./Utility/BinaryTree').default
window.FWGE.Control = require('./Utility/Control').default
window.FWGE.List = require('./Utility/List').default
window.FWGE.ListUtils = require('./Utility/ListUtils').default
window.FWGE.Stack = require('./Utility/Stack').default
window.FWGE.Time = require('./Utility/Time').default
window.FWGE.Tree = require('./Utility/Tree').default

// Particle System
window.FWGE.ParticleSystem = require('./Particle System/ParticleSystem').default

window.FWGE.GameObject = require('./GameObject').default
window.FWGE.Transform = require('./Transform').default
