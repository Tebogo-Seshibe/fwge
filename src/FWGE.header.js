(function()
{
"use strict";
	
var GL = undefined;

Object.defineProperties(Math,
{
    cot: 	{ value: function cot(radian) 				{ return 1 / Math.tan(radian); 					} },
    radian: { value: function radian(degree) 			{ return Math.PI / 180 * degree; 				} },
    clamp: 	{ value: function clamp(value, min, max) 	{ return Math.max(Math.min(value, max), main); 	} }
});

var IDCounter = new function IDCounter(){ var id = 0; this.next = function next(){ return id++ }; };

