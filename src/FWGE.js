/*!
 * 	@constructor 	FWGE
 *	@module			{}
 */
function FWGEPrototype()
{
	Object.defineProperties(this,
	{
		/*!
		 * 	@property		{GameEngine: Game}
		 *  @description	<link>GameEngine</link>
		 */
		Game: 		{value: new GameEngine()},

		/*!
		 * 	@property		{PhysicsEngine: Physics}
		 *  @description	<link>PhysicsEngine</link>
		 */
		Physics: 	{value: new PhysicsEngine()},

		/*!
		 * 	@property		{RenderEngine: Render}
		 *  @description	<link>RenderEngine</link>
		 */
		Render: 	{value: new RenderEngine()},

		/*!
		 * 	@function 		Init
		 *	@description 	Initializes the webgl context
		 *	@param			{Object: request}
		 * 					> {HTMLCanvasElement: canvas}
		 *					> {Number: height}
		 *					> {Number: width}
		 *					> {Float32Array: clear}
		 */
		Init: 
		{
			value: function Init(request)
			{
				if (!request) request = {};
				if (!request.clear) request.clear = [0, 0, 0, 0];

				GL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

				if (!GL)
					throw "Webgl context could not be initialized.";

				GL.clearColor(request.clear[0] || 0, request.clear[1] || 0, request.clear[2] || 0, request.clear[3] || 0);

				this.Game.Init();
				this.Physics.Init();
				this.Render.Init();
			}
		},

		/*!
		 * 	@function 		Start
		 * 	@description 	Starts up the engine
		 */
		Start: { value: function Start() { if (!!GL) this.Game.Start();  } },


		/*!
		 * 	@function 		Stop
		 * 	@description 	Stops the engine
		 */
		Stop:  { value: function Stop()  { this.Game.Stop(); } }
	});
}

window.FWGE = new FWGEPrototype();

