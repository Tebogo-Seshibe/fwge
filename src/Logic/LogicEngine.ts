import IEngine from '../IEngine';
import { GameObjects } from './Object/GameObject';
import { TimeKeep } from './Utility/Time';


export default class LogicEngine implements IEngine
{
    public Init(): void 
    {
        
    }

    public Update(timekeep: TimeKeep): void
    {
        // if (!timekeep.Ready) {
        //     return;
        // }
        
        GameObjects.forEach(gameObject => 
        {
            gameObject.Update(timekeep.Delta)
            
            if (gameObject.Collider)
            {
                gameObject.Collider.Update()
            }
        })
    }

    public Reset(): void
    {
        
    }
}
