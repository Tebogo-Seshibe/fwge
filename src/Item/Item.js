function Item()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        GameObject:       { value: GameObject },
        Mesh:             { value: Mesh },
        Material:         { value: Material },
        Transform:        { value: Transform },
        PhysicsItem:      { value: PhysicsItem },
        Collision:        { value: Collision },
        Animation:        { value: Animation },
        ParticleSystem:   { value: ParticleSystem }
    });
}

