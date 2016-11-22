function Other()
{
    var $ = this;
    
    Object.defineProperties($,
    {        
        File:     { value: new File() },
        Input:    { value: new Input() },
        Time:     { value: new Time() },
        Physics:     { value: new Physics() },
    });
}

