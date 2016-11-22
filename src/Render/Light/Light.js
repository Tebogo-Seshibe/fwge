function Light()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        Ambient:      { value: Ambient },
        Directional:  { value: Directional },
        Point:        { value: Point }       
    });
}

