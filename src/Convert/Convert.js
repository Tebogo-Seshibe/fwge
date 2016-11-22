function Convert()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        obj:      	{ value: new obj() },
        threejs:  	{ value: new threejs() },
        fbx:  		{ value: new fbx() },
        dae:  		{ value: new dae() }
    });
}

