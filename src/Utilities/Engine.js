function Engine()
{
	var $ = this;
	var _Running = false;
	var _AnimationFrame = undefined;

	Object.defineProperties($,
	{
		Run: 
		{ 
			value: function Run()
			{
				_AnimationFrame = window.requestAnimationFrame($.Run);

	            FWGE.Other.Time.TimeUpdate();

	            if (_Running)
	            {
		            FWGE.Other.Input.InputUpdate();
		            FWGE.Render.Camera.CameraUpdate();
		            
		            var i = __OBJECT__.length;
		            while (--i >= 0)
		                __OBJECT__[i].ObjectUpdate();

					__RENDERER__.Render();
				}
			}
		},
		Start: 	{ value: function Start() { if (!_Running) _Running = true; if (!_AnimationFrame) $.Run(); } },
		Stop: 	{ value: function Stop()  { if (_Running) _Running = false; } }
	});
};

