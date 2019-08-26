import GameObject from './GameObject';
import Destroyable from './Interfaces/Destroyable';
import Updateable from './Interfaces/Updateable';
import Item from './Item';
import List from './Utility/List';

export default interface GameItem extends Item, Updateable, Destroyable
{
    GameObjects: List<GameObject>
}