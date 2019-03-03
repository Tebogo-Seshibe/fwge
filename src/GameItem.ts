import Item from './Item'
import GameObject from './GameObject'
import Updateable from './Interfaces/Updateable'
import Destroyable from './Interfaces/Destroyable'
import List from './Utility/List'

export default interface GameItem extends Item, Updateable, Destroyable
{
    GameObjects: List<GameObject>
}