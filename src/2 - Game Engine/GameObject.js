/**
 * @name GameObject
 * @description The main object container for object types.   
 * @module      FWGE.Game
 */

window.GameObject = (function()
{
    /**
     * 
     */
    function GameObject({name, transform, material, mesh, physics, animation, begin = function Begin(){}, update = function Update(){}, end = function End(){}, children} = {})
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @property    {Children}
             * @type        {Array<GameObject>}
             */
            Children: { value: [], configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Transform}
             * @type        {Transform}
             */
            Transform: { value: transform instanceof Transform ? transform : new Transform(transform), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {RenderMaterial}
             * @type        {RenderMaterial}
             */
            Material: { value: material instanceof RenderMaterial ? material : undefined, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Mesh}
             * @type        {Mesh}
             */
            Mesh: { value: mesh instanceof Mesh ? mesh : undefined, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {PhysicsItem}
             * @type        {PhysicsItem}
             */
            Physics: { value: physics instanceof PhysicsItem ? physics : undefined, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Animation}
             * @type        {Animation}
             */
            Animation: { value: new Animation(animation), configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Begin}
             * @type        {Function}
             */
            Begin: { value: begin, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Update}
             * @type        {Function}
             */
            Update: { value: update, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {End}
             * @type        {Function}
             */
            End: { value: end, configurable: false, enumerable: true, writable: true }
        });
        
        GameObject.Objects.push(this);

        if (children)
            children.forEach(function(child){ self.Add(child); });

        this.Begin();

        Object.seal(this);
    }
    Object.defineProperties(GameObject,
    {
        /**
         * @property    {Objects}
         * @type        {Array}
         * @description List of all the objects in the scene
         */
        Objects: { value: [], configurable: false, enumerable: false, writable: false },

        /**
         * @function    Clone
         * @param       {GameObject} gameobject
         * @return      {GameObject}
         * @description Creates a clone of a gameobject. If no gameobject is provided,
         *              it creates a clone of the calling gameobject.
         */
        Clone:
        { 
            value: function Clone(gameObject)
            {
                var clone = new GameObject(
                {
                    name:       gameObject.Name,
                    transform:  new Transform(
                    {
                        position:   gameObject.Transform.Position.Buffer,
                        rotation:   gameObject.Transform.Rotation.Buffer,
                        scale:      gameObject.Transform.Scale.Buffer,
                        shear:      gameObject.Transform.Shear.Buffer
                    }),
                    mesh:       gameObject.Mesh,
                    material:   gameObject.Material,
                    physics:    gameObject.Physics,
                    begin:      gameObject.Begin,
                    update:     gameObject.Update,
                    end:        gameObject.End
                });
                
                for (var i = 0; i < gameObject.Children.length; ++i)
                    clone.Children.push(gameObject.Children[i].Clone());
                
                return clone;
            }
        }
    });

    GameObject.prototype = Object.create(null);
    Object.defineProperties(GameObject.prototype,
    {
        constructor: { value: GameObject },
        
        /**
         * @function    Add
         * @param       {GameObject}    gameobject
         * @return      {undefined}
         */
        Add:
        {
            value: function Add(gameObject)
            {
                let self = this;

                if (gameObject instanceof Array  && gameObject.length > 0)
                    gameObject.forEach(function(element) { self.Add(element); });

                else if (gameObject instanceof GameObject && gameObject !== this)
                {
                    var index = GameObject.Objects.indexOf(gameObject);

                    if (index !== -1)
                        GameObject.Objects.splice(index, 1);

                    this.Children.push(gameObject);
                }
            }
        },

        /**
         * @function    Remove
         * @param       {GameObject | number}    gameobject
         * @return      {GameObject}
         */
        Remove:
        {
            value: function Remove(gameObject)
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
        },
        
        /**
         * @function    Clone
         * @return      {GameObject}
         */
        Clone:
        {
            value: function Clone()
            {
                return GameObject.Clone(this);
            }
        },
        

        /**
         * @function    Destroy
         * @param       {number} timeout
         * @return      {undefined}
         */
        Destroy:
        {
            value: function Destroy(timeout)
            {
                var self = this;

                if (typeof timeout !== 'number')
                    timeout = 0;

                this.Children.forEach(child => {child.Destroy(timeout); });

                setTimeout(function()
                {
                    var i = GameObject.Objects.indexOf(self);
                    
                    if (i + -1)
                        GameObject.Objects.splice(i, 1);

                    self.End();
                }, 1000 * timeout);
            }
        },

        /**
         * @function        ObjectUpdate
         * @param           {GameEngine}    Game
         * @param           {PhysicsEngine} Physics
         * @return          {undefined}
         */        
        ObjectUpdate:
        {
            value: function ObjectUpdate(Game, Physics)
            {
                this.Update();
                this.Children.forEach(child => { child.ObjectUpdate(Game, Physics); });
            }
        }
    });
    Object.seal(GameObject.prototype);

    return GameObject;
})();
Object.seal(GameObject);
