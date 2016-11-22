function Render()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        Camera:   	{ value: new Camera() },
        Colour:   	{ value: new Colour() },
        GameScreen: { value: new GameScreen() },
        Shader:   	{ value: Shader },
        Light:    	{ value: new Light() }
    });
}

