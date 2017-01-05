/**
 * @constructor	GameEngine
 * @description	Something...
 * @module		FWGE
 */
function GameEngine()
{
	var _Running 		= false;
	var _AnimationFrame = undefined;

	Object.defineProperties(this,
	{
		/**
		 * @property	GameObject: {Function}
		 * @description	The GameObject constructor.
		 * @see			FWGE.Game.GameObject
		 */
		GameObject: 	{ value: GameObject },
		
		/**
		 * @property	Animation: {Function}
		 * @description	The Animation constructor.
		 * @see			FWGE.Game.Animation
		 */
		Animation: 		{ value: Animation },
		
		/**
		 * @property	Input: {Input}
		 * @description	The module that handles user inputs.
		 * @see			FWGE.Game.Input
		 */
		Input: 			{ value: new Input() },
		
		/**
		 * @property	Time: {Time}
		 * @description	The running clock.
		 * @see			FWGE.Game.Time
		 */
		Time: 			{ value: new Time() },
		
		/**
		 * @property	Transform {Transform}
		 * @description	The Transform constructor.
		 * @see			FWGE.Game.Transform
		 */
		Transform: 		{ value: Transform },
		
		/**
		 * @property	Light: {Light}
		 * @description	The Light module.
		 * @see			FWGE.Game.Light
		 */
		Light: 			{ value: new Light() },
		
		/**
		 * @property	Maths: {Maths}
		 * @description	The Maths module.
		 * @see			FWGE.Game.Maths
		 */
		Maths: 			{ value: new Maths() },
		
		/**
		 * @property	ParticleSystem: {Function}
		 * @description	The ParticleSystem constructor.
		 * @see			FWGE.Game.ParticleSystem
		 */
		ParticleSystem: { value: ParticleSystem },
		
		/**
		 * @property	Camera: {Camera}
		 * @description	The viewer.
		 * @see			FWGE.Game.Camera
		 */
		Camera: 		{ value: new Camera() },

        /**
         * @function       	Init: void
         * @description    	Initializes the game engine
         */
		Init:
		{
			value: function Init()
			{
				// TODO
			}
		},

        /**
         * @function       Run: void
         * @description    Runs the main game loop
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

        /**
         * @function       GameUpdate: void
         * @description    Updates the scene
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

        /**
         * @function       Start: void
         * @description    Initiates/resumes the main game loop
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

        /**
         * @function       Stop: void
         * @description    Suspends the main game loop
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

