export {}

declare global
{
	interface Window
	{
		FWGE: any

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
		FWGEEvent: any
		List: any
		ListUtils: any
		Stack: any
		Time: any
		Tree: any
		
		GameObject: any
		ParticleSystem: any
		Transform: any
	}
}

window.FWGE = require('./FWGE').default

//#region Audio
//#endregion


//#region Logic
window.GameObject = require('./Logic/GameObject').default
window.Transform = require('./Logic/Transform').default
window.Mesh = require('./Logic/Mesh').default

//#region Input
window.Input = require('./Logic/Input/Input').default
window.KeyboardInput = require('./Logic/Input/KeyboardInput').default
window.KeyboardState = require('./Logic/Input/InputState').KeyboardState
window.ButtonState = require('./Logic/Input/InputState').ButtonState
window.WheelState = require('./Logic/Input/InputState').WheelState
//#endregion

//#region Interfaces
window.Attachable = require('./Logic/Interfaces/Attachable').default
window.Cloneable = require('./Logic/Interfaces/Cloneable').default
window.Destroyable = require('./Logic/Interfaces/Destroyable').default
window.Updateable = require('./Logic/Interfaces/Updateable').default
//#endregion

//#region Maths
window.Maths = require('./Logic/Maths/Maths').default
window.Vector2 = require('./Logic/Maths/Vector2').default
window.Vector3 = require('./Logic/Maths/Vector3').default
window.Vector4 = require('./Logic/Maths/Vector4').default
window.Matrix2 = require('./Logic/Maths/Matrix2').default
window.Matrix3 = require('./Logic/Maths/Matrix3').default
window.Matrix4 = require('./Logic/Maths/Matrix4').default
//#endregion

//#region Utility
window.OBJConverter = require('./Logic/Utility/Converter/OBJConverter').default
window.ArrayUtils = require('./Logic/Utility/ArrayUtils').default
window.BinaryTree = require('./Logic/Utility/BinaryTree').default
window.List = require('./Logic/Utility/List').default
window.ListUtils = require('./Logic/Utility/ListUtils').default
window.Stack = require('./Logic/Utility/Stack').default
window.Time = require('./Logic/Utility/Time').default
window.Tree = require('./Logic/Utility/Tree').default
//#endregion
//#endregion


//#region Physics
//#region Collider
window.BoxCollider = require('./Physics/Collision/BoxCollider').default
window.Collider = require('./Physics/Collision/Collider').default
window.SphereCollider = require('./Physics/Collision/SphereCollider').default
//#endregion

window.CollisionEvent = require('./Physics/Collision/CollisionEvent').default
window.PhysicsBody = require('./Physics/PhysicsBody').default
window.PhysicsMaterial = require('./Physics/PhysicsMaterial').default
//#endregion


//#region Render

//#region Animation
window.Animation = require('./Render/Animation/Animation').default
window.IAnimation = require('./Render/Animation/Animation').IAnimation
//#endregion

//#region Camera
window.Camera = require('./Render/Camera/Camera').default
window.ICamera = require('./Render/Camera/Camera').ICamera
window.Viewer = require('./Render/Camera/Viewer').default
window.ViewMode = require('./Render/Camera/Viewer').ViewMode
//#endregion

//#region Colour
window.Colour4 = require('./Render/Colour/Colour3').default
window.Colour4 = require('./Render/Colour/Colour4').default
//#endregion

//#region Light
window.AmbientLight = require('./Render/Light/AmbientLight').default
window.IAmbientLight = require('./Render/Light/AmbientLight').IAmbientLight
window.DirectionalLight = require('./Render/Light/DirectionalLight').default
window.IDirectionalLight = require('./Render/Light/DirectionalLight').IDirectionalLight
window.ILightItem = require('./Render/Light/LightItem').ILightItem
window.PointLight = require('./Render/Light/PointLight').default
window.IPointLight = require('./Render/Light/PointLight').IPointLight
//#endregion

//#region Particle System
window.ParticleSystem = require('./Render/Particle System/ParticleSystem').default
//#endregion

//#region Shader
window.Shader = require('./Render/Shader/Shader').default
window.IShader = require('./Render/Shader/Shader').IShader
//#endregion

window.ModelView = require('./Render/ModelView').default
window.RenderMaterial = require('./Render/RenderMaterial').default
//#endregion
