/*!
 *	@constructor	GameEngine
 *	@module			FWGE
 *	@description	Something...
 */
function GameEngine()
{
	var _Running 		= false;
	var _AnimationFrame = undefined;

	Object.defineProperties(this,
	{
		GameObject: 	{value: GameObject},
		Animation: 		{value: Animation},
		Input: 			{value: new Input()},
		Time: 			{value: new Time()},
		Transform: 		{value: Transform},
		Light: 			{value: new Light()},
		Maths: 			{value: new Maths()},
		ParticleSystem: {value: ParticleSystem},
		Particle: 		{value: Particle},
		Camera: 		{value: new Camera()},

        /*!
         *  @function       {undefined: Init}
         *  @description    Initializes the game engine
         */
		Init:
		{
			value: function Init()
			{
				// TODO
			}
		},

        /*!
         *  @function       {undefined: Run}
         *  @description    Runs the main game loop
         */
		Run: 
		{ 
			value: function Run()
			{
				_AnimationFrame = window.requestAnimationFrame(FWGE.Game.Run);

	            if (_Running)
	            {   
		            FWGE.Game.GameUpdate();
		            FWGE.Physics.PhysicsUpdate();
		            FWGE.Render.RenderUpdate();
				}
			}
		},

        /*!
         *  @function       {undefined: GameUpdate}
         *  @description    Updates the objects
         */
		GameUpdate:
		{
			value: function GameUpdate()
			{
	            FWGE.Game.Time.TimeUpdate();

	            var i = __OBJECT__.length;
	            while (--i >= 0)
	                __OBJECT__[i].ObjectUpdate();

	            FWGE.Game.Input.InputUpdate();
			}
		},

        /*!
         *  @function       {undefined: Start}
         *  @description    Initiates/resumes the main game loop
         */
		Start:
		{
			value: function Start()
			{
				if(!_Running)
					_Running = true;

				if (!_AnimationFrame)
					this.Run();
			}
		},

        /*!
         *  @function       {undefined: Stop}
         *  @description    Suspends the main game loop
         */
		Stop:
		{
			value: function Stop()
			{
				if (_Running)
					_Running = false;

				if (!!_AnimationFrame)
				{
					window.cancelAnimationFrame(_AnimationFrame);
					_AnimationFrame = undefined;
				}
			}
		}
	});
};

