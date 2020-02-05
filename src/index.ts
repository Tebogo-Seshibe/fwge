import Main from './Main'
import { Animation, AnimationFrame } from './Animation/index'
import { Camera } from './Logic/Camera/index'
import { OBJConverter } from './Logic/Converter/index'
import { Input, ButtonState, KeyboardState, WheelState } from './Logic/Input/index'
import { AmbientLight, DirectionalLight, PointLight, ShadowQuality } from './Logic/Light/index'
import { Equations, Matrix2, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from './Logic/Maths/index'

class FWGE
{
	//#region 
	Main: any
	//#endregion

	//#region Animation
	Animation: any
	AnimationFrame: any
	//#endregion

	//#region Camera
	Camera: any
	//#endregion

	//#region Converter
	OBJConverter: any
	//#endregion

	//#region Input
	Input: any
	ButtonState: any
	KeyboardState: any
	WheelState: any
	//#endregion
	
	//#region Light
	AmbientLight: any
	DirectionalLight: any
	PointLight: any
	ShadowQuality: any
	//#endregion

	//#region Maths
	Equations: any
	Vector2: any
	Vector3: any
	Vector4: any
	Matrix2: any
	Matrix3: any
	Matrix4: any
	//#endregion
}

declare global
{
	interface Window
	{
		FWGE: FWGE
	}
}

window.FWGE = new FWGE

window.FWGE.Main = Main

window.FWGE.Animation = Animation
window.FWGE.AnimationFrame = AnimationFrame

window.FWGE.Camera = Camera

window.FWGE.OBJConverter = OBJConverter

window.FWGE.Input = Input
window.FWGE.ButtonState = ButtonState
window.FWGE.KeyboardState = KeyboardState
window.FWGE.WheelState = WheelState

window.FWGE.AmbientLight = AmbientLight
window.FWGE.DirectionalLight = DirectionalLight
window.FWGE.PointLight = PointLight
window.FWGE.ShadowQuality = ShadowQuality

window.FWGE.Equations = Equations
window.FWGE.Matrix2 = Matrix2
window.FWGE.Matrix3 = Matrix3
window.FWGE.Matrix4 = Matrix4
window.FWGE.Vector2 = Vector2
window.FWGE.Vector3 = Vector3
window.FWGE.Vector4 = Vector4

export { }
