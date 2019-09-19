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

		Collider: any
		CircleCollider: any
		SquareCollider: any
		SphereCollider: any
		CubeCollider: any
		CollisionEvent: any
		PhysicsMaterial: any

		Colour3: any
		Colour4: any

		OBJConverter: any

		Input: any
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

		// Maths: any
		Vector2: any
		Vector3: any
		Vector4: any
		Matrix2: any
		Matrix3: any
		Matrix4: any

		ParticleSystem: any

		Shader: any
		IShader: any

		ArrayUtils: any
		BinaryTree: any
		List: any
		ListUtils: any
		Stack: any
		Time: any
		Tree: any

		GameObject: any
		Material: any
		Mesh: any
		RigidBody: any
		Transform: any
	}
}

window.FWGE = require('./FWGE').default

window.Animation = require('./Logic/Animation/Animation').default
window.IAnimation = require('./Logic/Animation/Animation').IAnimation

window.Camera = require('./Logic/Camera/Camera').default
window.ICamera = require('./Logic/Camera/Camera').ICamera
window.Viewer = require('./Logic/Camera/Viewer').default
window.ViewMode = require('./Logic/Camera/Viewer').ViewMode

window.Collider = require('./Logic/Collision/Collider').default
window.CircleCollider = require('./Logic/Collision/CircleCollider').default
window.SquareCollider = require('./Logic/Collision/SquareCollider').default
window.SphereCollider = require('./Logic/Collision/SphereCollider').default
window.CubeCollider = require('./Logic/Collision/CubeCollider').default
window.CollisionEvent = require('./Logic/Collision/CollisionEvent').default
window.PhysicsMaterial = require('./Logic/Collision/PhysicsMaterial').default

window.Colour3 = require('./Logic/Colour/Colour3').default
window.Colour4 = require('./Logic/Colour/Colour4').default

window.OBJConverter = require('./Logic/Converter/OBJConverter').default

window.Input = require('./Logic/Input/Input').default
window.KeyboardState = require('./Logic/Input/InputState').KeyboardState
window.ButtonState = require('./Logic/Input/InputState').ButtonState
window.WheelState = require('./Logic/Input/InputState').WheelState

window.Attachable = require('./Logic/Interfaces/Attachable').default
window.Cloneable = require('./Logic/Interfaces/Cloneable').default
window.Destroyable = require('./Logic/Interfaces/Destroyable').default
window.Updateable = require('./Logic/Interfaces/Updateable').default

window.AmbientLight = require('./Logic/Light/AmbientLight').default
window.IAmbientLight = require('./Logic/Light/AmbientLight').IAmbientLight
window.DirectionalLight = require('./Logic/Light/DirectionalLight').default
window.IDirectionalLight = require('./Logic/Light/DirectionalLight').IDirectionalLight
window.PointLight = require('./Logic/Light/PointLight').default
window.IPointLight = require('./Logic/Light/PointLight').IPointLight

/*window.Maths = */ require('./Logic/Maths/Maths').default
window.Vector2 = require('./Logic/Maths/Vector2').default
window.Vector3 = require('./Logic/Maths/Vector3').default
window.Vector4 = require('./Logic/Maths/Vector4').default
window.Matrix2 = require('./Logic/Maths/Matrix2').default
window.Matrix3 = require('./Logic/Maths/Matrix3').default
window.Matrix4 = require('./Logic/Maths/Matrix4').default

window.ParticleSystem = require('./Logic/Particle System/ParticleSystem').default

window.Shader = require('./Logic/Shader/Shader').default
window.IShader = require('./Logic/Shader/Shader').IShader

window.ArrayUtils = require('./Logic/Utility/ArrayUtils').default
window.BinaryTree = require('./Logic/Utility/BinaryTree').default
window.List = require('./Logic/Utility/List').default
window.ListUtils = require('./Logic/Utility/ListUtils').default
window.Stack = require('./Logic/Utility/Stack').default
window.Time = require('./Logic/Utility/Time').default
window.Tree = require('./Logic/Utility/Tree').default

window.GameObject = require('./Logic/GameObject').default
window.Material = require('./Logic/Material').default
window.Mesh = require('./Logic/Mesh').default
window.RigidBody = require('./Logic/RigidBody').default
window.Transform = require('./Logic/Transform').default