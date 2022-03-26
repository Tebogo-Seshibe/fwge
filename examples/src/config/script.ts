import { Game, Script, Transform } from "@fwge/core"

export function configureScripts(game: Game): void
{
    const scriptLibrary = game.GetLibrary(Script)
        
    scriptLibrary
        .Add('Logger', new Script(
        {
            start(){},
            update(delta: number)
            {
                this.GetComponent(Transform)!.Rotation.Y += delta * 0.1
            },
            end(){}
        }))
        .Add('Spinner', new Script(
        {
            update(delta: number)
            {
                switch (this.Id % 6)
                {
                    case 0:
                        this.GetComponent(Transform)!.Rotation.Y +=  0.05 * delta
                        break
                    case 1:
                        this.GetComponent(Transform)!.Rotation.Y += -0.05 * delta
                        break
                    case 2:
                        this.GetComponent(Transform)!.Rotation.X +=  0.05 * delta
                        break
                    case 3:
                        this.GetComponent(Transform)!.Rotation.X += -0.05 * delta
                        break
                    case 4:
                        this.GetComponent(Transform)!.Rotation.Z +=  0.05 * delta
                        break
                    case 5:
                        this.GetComponent(Transform)!.Rotation.Z += -0.05 * delta
                        break
                }
            }
        }))
        .Add('Rotator', new Script(
          {
              start()
              {
                this.GetComponent(Transform)!.Rotation.Set(0, Math.random() * 360, Math.random() * 360)
              },
              update(delta: number)
              {
                this.GetComponent(Transform)!.Rotation.Y += delta / 7
                this.GetComponent(Transform)!.Rotation.Z += delta / 12
              }
          })
        )
}
