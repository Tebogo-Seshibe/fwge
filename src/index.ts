export {}

declare global
{
	interface Window
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

// Animation
window.Animation = require('./Animation/Animation').default
window.IAnimation = require('./Animation/Animation').IAnimation

// Camera
window.Camera = require('./Camera/Camera').default
window.ICamera = require('./Camera/Camera').ICamera
window.Viewer = require('./Camera/Viewer').default
window.ViewMode = require('./Camera/Viewer').ViewMode

// Input
window.Input = require('./Input/Input').default
window.ControllerInput = require('./Input/ControllerInput').default
window.MouseInput = require('./Input/MouseInput').default
window.KeyboardInput = require('./Input/KeyboardInput').default
window.KeyboardState = require('./Input/InputState').KeyboardState
window.ButtonState = require('./Input/InputState').ButtonState
window.WheelState = require('./Input/InputState').WheelState

// Interfaces
window.Attachable = require('./Interfaces/Attachable').default
window.Cloneable = require('./Interfaces/Cloneable').default
window.Destroyable = require('./Interfaces/Destroyable').default
window.Updateable = require('./Interfaces/Updateable').default

// // Light
window.AmbientLight = require('./Light/AmbientLight').default
window.IAmbientLight = require('./Light/AmbientLight').IAmbientLight
window.DirectionalLight = require('./Light/DirectionalLight').default
window.IDirectionalLight = require('./Light/DirectionalLight').IDirectionalLight
window.ILightItem = require('./Light/LightItem').ILightItem
window.PointLight = require('./Light/PointLight').default
window.IPointLight = require('./Light/PointLight').IPointLight

// // Maths
window.Maths = require('./Maths/Maths').default
window.Vector2 = require('./Maths/Vector2').default
window.Vector3 = require('./Maths/Vector3').default
window.Vector4 = require('./Maths/Vector4').default
window.Matrix2 = require('./Maths/Matrix2').default
window.Matrix3 = require('./Maths/Matrix3').default
window.Matrix4 = require('./Maths/Matrix4').default

// Physics
// Physics Coliison
window.BoxCollider = require('./Physics/Collision/BoxCollider').default
window.Collider = require('./Physics/Collision/Collider').default
window.SphereCollider = require('./Physics/Collision/SphereCollider').default
window.CollisionEvent = require('./Physics/Collision/CollisionEvent').default
window.PhysicsBody = require('./Physics/PhysicsBody').default
window.PhysicsMaterial = require('./Physics/PhysicsMaterial').default

// Render
window.Colour4 = require('./Render/Colour4').default
window.Mesh = require('./Render/Mesh').default
window.Projection = require('./Render/Projection').default
window.ModelView = require('./Render/ModelView').default
window.RenderMaterial = require('./Render/RenderMaterial').default

// Shader
window.Shader = require('./Shader/Shader').default
window.IShader = require('./Shader/Shader').IShader

// Utility
// Converter
window.OBJConverter = require('./Utility/Converter/OBJConverter').default
window.ArrayUtils = require('./Utility/ArrayUtils').default
window.BinaryTree = require('./Utility/BinaryTree').default
window.Control = require('./Utility/Control').default
window.FWGEEvent = require('./Utility/FWGEEvent').default
window.List = require('./Utility/List').default
window.ListUtils = require('./Utility/ListUtils').default
window.Stack = require('./Utility/Stack').default
window.Time = require('./Utility/Time').default
window.Tree = require('./Utility/Tree').default

window.FWGE = require('./FWGE').default
window.GameObject = require('./GameObject').default
window.ParticleSystem = require('./ParticleSystem').default
window.Transform = require('./Transform').default
