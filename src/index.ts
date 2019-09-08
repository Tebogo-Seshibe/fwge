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

window.FWGE = { }

//#region Audio
//#endregion


//#region Logic
window.FWGE.GameObject = require('./Logic/GameObject').default
window.FWGE.Transform = require('./Logic/Transform').default
window.FWGE.Mesh = require('./Logic/Mesh').default

//#region Input
window.FWGE.Input = require('./Logic/Input/Input').default
window.FWGE.KeyboardInput = require('./Logic/Input/KeyboardInput').default
window.FWGE.KeyboardState = require('./Logic/Input/InputState').KeyboardState
window.FWGE.ButtonState = require('./Logic/Input/InputState').ButtonState
window.FWGE.WheelState = require('./Logic/Input/InputState').WheelState
//#endregion

//#region Interfaces
window.FWGE.Attachable = require('./Logic/Interfaces/Attachable').default
window.FWGE.Cloneable = require('./Logic/Interfaces/Cloneable').default
window.FWGE.Destroyable = require('./Logic/Interfaces/Destroyable').default
window.FWGE.Updateable = require('./Logic/Interfaces/Updateable').default
//#endregion

//#region Maths
window.FWGE.Maths = require('./Logic/Maths/Maths').default
window.FWGE.Vector2 = require('./Logic/Maths/Vector2').default
window.FWGE.Vector3 = require('./Logic/Maths/Vector3').default
window.FWGE.Vector4 = require('./Logic/Maths/Vector4').default
window.FWGE.Matrix2 = require('./Logic/Maths/Matrix2').default
window.FWGE.Matrix3 = require('./Logic/Maths/Matrix3').default
window.FWGE.Matrix4 = require('./Logic/Maths/Matrix4').default
//#endregion

//#region Utility
window.FWGE.OBJConverter = require('./Logic/Utility/Converter/OBJConverter').default
window.FWGE.ArrayUtils = require('./Logic/Utility/ArrayUtils').default
window.FWGE.BinaryTree = require('./Logic/Utility/BinaryTree').default
window.FWGE.Control = require('./Logic/Utility/Control').default
window.FWGE.List = require('./Logic/Utility/List').default
window.FWGE.ListUtils = require('./Logic/Utility/ListUtils').default
window.FWGE.Stack = require('./Logic/Utility/Stack').default
window.FWGE.Time = require('./Logic/Utility/Time').default
window.FWGE.Tree = require('./Logic/Utility/Tree').default
//#endregion
//#endregion


//#region Physics
//#region Collider
window.FWGE.BoxCollider = require('./Physics/Collision/BoxCollider').default
window.FWGE.Collider = require('./Physics/Collision/Collider').default
window.FWGE.SphereCollider = require('./Physics/Collision/SphereCollider').default
//#endregion

window.FWGE.CollisionEvent = require('./Physics/Collision/CollisionEvent').default
window.FWGE.PhysicsBody = require('./Physics/PhysicsBody').default
window.FWGE.PhysicsMaterial = require('./Physics/PhysicsMaterial').default
//#endregion


//#region Render

//#region Animation
window.FWGE.Animation = require('./Render/Animation/Animation').default
window.FWGE.IAnimation = require('./Render/Animation/Animation').IAnimation
//#endregion

//#region Camera
window.FWGE.Camera = require('./Render/Camera/Camera').default
window.FWGE.ICamera = require('./Render/Camera/Camera').ICamera
window.FWGE.Viewer = require('./Render/Camera/Viewer').default
window.FWGE.ViewMode = require('./Render/Camera/Viewer').ViewMode
//#endregion

//#region Colour
window.FWGE.Colour4 = require('./Render/Colour/Colour3').default
window.FWGE.Colour4 = require('./Render/Colour/Colour4').default
//#endregion

//#region Light
window.FWGE.AmbientLight = require('./Render/Light/AmbientLight').default
window.FWGE.IAmbientLight = require('./Render/Light/AmbientLight').IAmbientLight
window.FWGE.DirectionalLight = require('./Render/Light/DirectionalLight').default
window.FWGE.IDirectionalLight = require('./Render/Light/DirectionalLight').IDirectionalLight
window.FWGE.ILightItem = require('./Render/Light/LightItem').ILightItem
window.FWGE.PointLight = require('./Render/Light/PointLight').default
window.FWGE.IPointLight = require('./Render/Light/PointLight').IPointLight
//#endregion

//#region Particle System
window.FWGE.ParticleSystem = require('./Render/Particle System/ParticleSystem').default
//#endregion

//#region Shader
window.FWGE.Shader = require('./Render/Shader/Shader').default
window.FWGE.IShader = require('./Render/Shader/Shader').IShader
//#endregion

window.FWGE.ModelView = require('./Render/ModelView').default
window.FWGE.RenderMaterial = require('./Render/RenderMaterial').default
//#endregion
