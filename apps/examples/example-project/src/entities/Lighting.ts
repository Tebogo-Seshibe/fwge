import { AreaLight, DirectionalLight, PointLight, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";

export class Lighting extends Entity
{
    Init(): void
    {
        [
            ...this.CreateAreaLights(),
            ...this.CreateDirectionalLights(),
            ...this.CreatePointLights(),
        ].forEach(child => this.AddChild(child))

        this.AddComponent(new Transform());
    }

    CreateAreaLights()
    {
        const children = [];
        
        const environment = new Entity()
            .AddComponents(
                new AreaLight(
                {
                    colour: [1, 1, 1],
                    intensity: 0.35
                })
            );
        children.push(environment)

        return children;
    }

    CreateDirectionalLights()
    {
        const children = [];

        const sun = new Entity()
            .AddComponents(
                new Transform(
                {
                    rotation: [10,0,0]
                }),
                new DirectionalLight(
                {
                    castShadows: true,
                    colour: [1,1,1],
                    intensity: 0.5,
                })
            )
        children.push(sun)

        return children;
    }

    CreatePointLights()
    {
        const children = [];
        const radius = 2;
        const step = 2;
        const y = 1;

        for (let x = -radius; x <= radius; x += step)
        {
            for (let z = -radius; z <= radius; z += step)
            {
                const child = new Entity()
                    .AddComponents(
                        new Transform({ position: [x, y, z] }),
                        new PointLight(
                        { 
                            colour: [Math.random(), Math.random(), Math.random()],
                            intensity: 0.2,
                            radius: 2,
                        })
                    );
                children.push(child)
            }
        }

        return children;
    }
}