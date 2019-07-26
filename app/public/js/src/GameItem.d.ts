import Item from './Item';
import Destroyable from './Interfaces/Destroyable';
import GameObject from './GameObject';
import List from './Utility/List';
import Updateable from './Interfaces/Updateable';
export default interface GameItem extends Item, Updateable, Destroyable {
    GameObjects: List<GameObject>;
}
