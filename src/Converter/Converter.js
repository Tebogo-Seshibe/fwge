/**
 * @name        Converter
 * @module      FWGE.Game
 * @description Base object converter
 */

let Converter = (function()
{
    /**
     * 
     * @param {Function} parse 
     * @param {Function} gameobject 
     * @param {Function} mesh 
     * @param {Function} rendermaterial 
     */
    function Converter(parse = function Parse(){}, gameobject = function ParseGameObject(){}, mesh = function ParseMesh(){}, rendermaterial = function ParseRenderMaterial(){})
    {
        Object.defineProperties(this,
        {
            /**
             * @function    Read
             * @param       {string}    path
             * @return      {string}
             */
            Read:
            {
                value: function Read(path)
                {
                    let xml = new XMLHttpRequest();

                    xml.open('GET', path, false);
                    xml.send(null);
                    
                    return xml.responseText;
                },
                configurable: false, enumerable: true, writable: false
            },

            /**
             * @function    Parse
             * @return      {GameObject}
             */
            Parse: { value: parse, configurable: false, enumerable: true, writable: false },
            
            /**
             * @function    GameObject
             * @return      {GameObject}
             */
            ParseGameObject: { value: gameobject, configurable: false, enumerable: true, writable: false },
            
            /**
             * @function    Mesh
             * @return      {Mesh}
             */
            ParseMesh: { value: mesh, configurable: false, enumerable: true, writable: false },
            
            /**
             * @function    RenderMaterial
             * @return      {RenderMaterial}
             */
            ParseRenderMaterial: { value: rendermaterial, configurable: false, enumerable: true, writable: false }
        });
    }

    Converter.prototype = Object.create(null);
    Object.seal(Converter.prototype);

    return Converter;
})();
Object.seal(Converter);
