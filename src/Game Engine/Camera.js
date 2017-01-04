/*!
 *  @constructor    Camera
 *  @module         FWGE.GameEngine
 *  @description    Something...
 */
function Camera()
{
    var _Mode   = 0;
    var _FOV    = 35;
    var _Aspect = 16/9;
    var _Near   = 0.1;
    var _Far    = 900;
    var _Left   = -10;
    var _Right  = 10;
    var _Top    = 10;
    var _Bottom = 10;
    var _Theta  = 90;
    var _Phi    = 90;

    Object.defineProperties(this,
    {
    	PERSPECTIVE:  { value: 0 },
    	ORTHOGRAPHIC: { value: 1 },
        
    	Mode:
    	{ 
    		get: function getMode() { return _Mode; },
    		set: function setMode()
    		{ 
    			if (arguments[0] === this.PERSPECTIVE || arguments[0] === this.ORTHOGRAPHIC)
    				_Mode = arguments[0];
    		}
    	}, 
    	FOV:
    	{ 
    		get: function getFOV() { return _FOV; },
    		set: function setFOV()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_FOV = arguments[0];
    		}
    	},
    	Aspect:
    	{ 
    		get: function getAspect() { return _Aspect; },
    		set: function setAspect()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Aspect = arguments[0];
    		}
    	},
    	Near:
    	{ 
    		get: function getNear() { return _Near; },
    		set: function setNear()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Near = arguments[0];
    		}
    	},
    	Far:
    	{ 
    		get: function getFar() { return _Far; },
    		set: function setFar()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Far = arguments[0];
    		}
    	},
    	Left:
    	{ 
    		get: function getLeft() { return _Left; },
    		set: function setLeft()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Left = arguments[0];
    		}
    	},
    	Right:
    	{ 
    		get: function getRight() { return _Right; },
    		set: function setRight()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Right = arguments[0];
    		}
    	},
    	Top:
    	{ 
    		get: function getTop() { return _Top; },
    		set: function setTop()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Top = arguments[0];
    		}
    	},
    	Bottom:
    	{ 
    		get: function getBottom() { return _Bottom; },
    		set: function setBottom()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Bottom = arguments[0];
    		}
    	},
    	Theta:
    	{ 
    		get: function getTheta() { return _Theta; },
    		set: function setTheta()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Theta = arguments[0];
    		}
    	},
    	Phi:
    	{ 
    		get: function getPhi() { return _Phi; },
    		set: function setPhi()
    		{ 
    			if (typeof arguments[0] === 'number')
    				_Phi = arguments[0];
    		}
    	},
        CameraUpdate:
        {
            value: function CameraUpdate()
            {
                GL.canvas.height = GL.canvas.clientHeight;
                GL.canvas.width = GL.canvas.clientWidth;
				_Aspect = GL.drawingBufferWidth/GL.drawingBufferHeight;
            }
        }
    });
}

