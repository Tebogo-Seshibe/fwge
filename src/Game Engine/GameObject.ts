import { Item } from "./Item";
import { Transform } from "./Transform";
import { LightItem } from "./Light/LightItem";
import { Animation } from "./Animation";
import { PhysicsItem } from "../Physics Engine/PhysicsItem";
import { Mesh } from "../Render Engine/Mesh";

export interface IGameObject
{
    Name?:           string;
    Transform?:      Transform;
    Material?:       RenderMaterial | null;
    Mesh?:           Mesh | null;
    Light?:          LightItem | null;
    Physics?:        PhysicsItem | null;
    Animation?:      Animation | null;
    ParticleSystem?: ParticleSystem | null;
    Begin?:          Function;
    Update?:         Function;
    End?:            Function;
}

/**
 * @name GameObject
 * @description The main object container for object types.   
 * @module      FWGE.Game
 */
export class GameObject extends Item
{
    public static Objects: Array<GameObject> = new Array<GameObject>()

    /**
     * @property    Children:   {Array} [read]
     * @description An array of gameobjects. All children transformation will be relative to 
     *              the parent gameobject.
     */
    public readonly Children: Array<GameObject> = new Array<GameObject>();

    /**
     * @property    Transform:  {Transform} [read]
     * @description The transform object attached to the current gameobject
     */
    public Transform: Transform;

    /**
     * @property    RenderMaterial: {RenderMaterial} [read|write]
     * @description The render material attached to this gameobject.
     */
    public Material: RenderMaterial | null;

    /**
     * @property    Mesh: {Mesh} [read|write]
     * @description The mesh attached to this gameobject.
     */
    public Mesh: Mesh | null;

    /**
     * @property    LightItem: {LightItem} [read|write]
     * @description The light item attached to this gameobject.
     */
    public Light: LightItem | null;

    /**
     * @property    PhysicsItem: {PhysicsItem} [read|write]
     * @description The physics item attached to this gameobject.
     */
    public Physics: PhysicsItem | null;

    /**
     * @property    Animation: {Animation} [read|write]
     * @description The animation attached to this gameobject.
     */
    public Animation: Animation | null;

    /**
     * @property    particlesystem: {ParticleSystem} [read|write]
     * @description The particle system attached to this gameobject.
     */
    public ParticleSystem: ParticleSystem | null;

    /**
     * @property    Begin:{Function} [read|write]
     * @description This method is called upon object creation.
     */
    public Begin: Function;

    /**
     * @property    Update: {Function} [read|write]
     * @description This method is called after each render frame
     */
    public Update: Function;

    /**
     * @property    End: {Function} [read|write]
     * @description This method is called once the gameobject if destroyed.
     */
    public End: Function;
    
    constructor(request: IGameObject)
    {
        super(request.Name || "Game Object");

        this.Transform      = new Transform(request.Transform || {});
        this.Animation      = request.Animation      || null;
        this.Material       = request.Material       || null;
        this.Mesh           = request.Mesh           || null;
        this.Physics        = request.Physics        || null;
        this.ParticleSystem = request.ParticleSystem || null;
        this.Light          = request.Light          || null;

        this.Begin  = request.Begin  ||  new Function();
        this.Update = request.Update ||  new Function();
        this.End    = request.End    ||  new Function();

        GameObject.Objects.push(this);
        this.Begin();
    }

    public Add(gameObject: GameObject | Array<GameObject>): void
    {
        let self = this;

        if (gameObject instanceof Array  && gameObject.length > 0)
            gameObject.forEach(function(element: GameObject | Array<GameObject>) { self.Add(element); });

        else if (gameObject instanceof GameObject && gameObject !== this)
        {
            var index = GameObject.Objects.indexOf(gameObject);

            if (index !== -1)
                GameObject.Objects.splice(index, 1);

            this.Children.push(gameObject);
        }
    }

    public Remove(gameObject: GameObject | number): GameObject | null
    {
        if (gameObject instanceof GameObject)
            gameObject = this.Children.indexOf(gameObject);
            
        if (gameObject >= 0)
        {
            gameObject = this.Children.splice(gameObject, 1)[0];
            GameObject.Objects.push(gameObject);
            return gameObject;
        }
        
        return null;
    }
    
    public Clone(): GameObject
    {
        return GameObject.Clone(this);
    }
    
    /**
     * @function    Clone: {GameObject}
     * @description Creates a clone of a gameobject. If no gameobject is provided,
     *              it creates a clone of the calling gameobject.
     * @param       gameobject:  {GameObject} [nullable]
     */

    public static Clone(gameObject: GameObject): GameObject
    {
        var clone = new GameObject(gameObject);
        
        for (var i = 0; i < gameObject.Children.length; ++i)
            clone.Children.push(gameObject.Children[i].Clone());
        
        return clone;
    }

    /**
     * @function    Destroy: {undefined}
     * @description Destroys the object after a given amount of time
     * @param       timeout: {Number}
     */
    Destroy(timeout: number = 0): void
    {
        var self = this;

        if (typeof timeout !== 'number')
            timeout = 0;

        this.Children.forEach(function(child) {child.Destroy(timeout);});

        setTimeout(function()
        {
            var i = GameObject.Objects.length;
            while (--i >= 0)
            {
                if (GameObject.Objects[i] === self)
                {
                    GameObject.Objects.splice(i, 1);
                    break;
                }
            }
            self.End();
        }, 1000 * timeout);
    }

    /**
     * @function        ObjectUpdate: {undefined}
     * @description     Updates the object
     */
    
    ObjectUpdate(Game: GameEngine, Physics: PhysicsEngine): void
    {
        this.Update();
        this.Transform.Update();
        if (!!this.Physics)         this.Physics.Update(Game, Physics);
        if (!!this.Animation)       this.Animation.Update();
        if (!!this.ParticleSystem)  this.ParticleSystem.Update();

        this.Children.forEach(element => { element.ObjectUpdate(Game, Physics); });
    }
}
