class BufferedArray<T>
{
    [index:number]: T;
    readonly Buffer: Array<T>;

    public constructor()
    public constructor(length: number)
    public constructor(args?: any)
    {
        this.Buffer = new Array<T>(args);
    }
}
/**
 * @interface   Destructable
 * @description Represennts an object that can be destroyed
 */
interface Destructable
{
    Destroy(): void;
}
interface IKeyFrame<T>
{
    Before: T;
    After:  T;
    Current: T;
    Length: number;
}

class KeyFrame<T>
{
    public readonly Before: T;
    public readonly After:  T;
    public readonly Length: number;
    public Current: T;
    private Offset: T;

    constructor(request: IKeyFrame<T>)
    {
        this.Before = request.Before;
        this.After  = request.After;
        this.Length = request.Length;
    }
}

/**
 * @interface   Updatable
 * @description Represents an object that can be updated
 */
interface Updatable
{
    Update(): void;
}




class Converter
{
    protected Read(path: string): string
    {
        let xml = new XMLHttpRequest();

        xml.open('GET', path, false);
        xml.send(null);
        
        return xml.responseText;
    }

    public Parse(...files: string[]): GameObject { return };
    protected GameObject(...args: any[]): GameObject { return };
    protected Mesh(...args: any[]): Mesh { return };
    protected RenderMaterial(...args: any[]): RenderMaterial { return };
}
/**
 * @name        Item
 * @module      FWGE.Game
 * @description The base object for every item
 *              used within the game engine.
 */
class Item
{
    /**
     * @type        {String}
     * @description A string descriptor for the type of item.
     */
    public Name: string;

    /**
     * @type        {String}
     * @description A simple string naming the item
     */
    public readonly ID: number;

    private static ID_COUNTER = 0;
    private static hashcode(number: number): number
    {
        var i:          number = 0;
        var hash:       number = 0;
        var chr:        number = 0;
        var string:     string = number + "";

        for (i = 0; i < string.length; i++)
        {
            chr   = string.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }

        return hash;
    }

    constructor(name: string)
    {
        this.Name   = name;
        this.ID     = Item.hashcode(Item.ID_COUNTER++);
    }
}




/**
 * @name        GameItem
 * @description The base container for objects used within the scene.
 * @module      FWGE.Game
 */
class GameItem extends Item
{
    /**
     * @property    GameObject: {GameObject} [read|write]
     * @description The GameObject this item is attached to.
     */
    public GameObject: GameObject | null;

    constructor(name: string, gameObject: GameObject | null)
    {
        super(name);
        this.GameObject = gameObject;
    }
}



class ITransform
{
    Position:   number[] = [0, 0, 0];
    Rotation:   number[] = [0, 0, 0];
    Scale:      number[] = [1, 1, 1];
    Shear:      number[] = [0, 0, 0];
}

/**
 * @name        Transform
 * @module      FWGE.Game
 * @description This object contains all the transformations that 
 *              are to be applied to the parent gameobject.
 */
class Transform
{    
    /**
     * @property    Position: {Float32Array} [read|write]
     * @description The current position of the parent of gameobject
     */
    public Position:   Vector3;

    /**
     * @property    Rotation: {Float32Array} [read|write]
     * @description The current rotation of the parent of gameobject
     */           
    public Rotation:   Vector3;
    
    /**
     * @property    Scale: {Float32Array} [read|write]
     * @description The current scaling of the parent of gameobject
     */
    public Scale:      Vector3;

    /**
     * @property    Shear: {Float32Array} [read|write]
     * @description The current shearing of the parent of gameobject
     */
    public Shear:      Vector3;

    /**
     * @property    Up: {Float32Array} [read]
     * @description The parent gameobject"s up vector
     */
    public readonly UP:        Vector3 = new Vector3(0, 1, 0);
    
    /**
     * @property    Forward: {Float32Array} [read]
     * @description The parent gameobject"s forward vector
     */
    public readonly FORWARD:   Vector3 = new Vector3(0, 0, 1);
    
    /**
     * @property    Right: {Float32Array} [read]
     * @description The parent gameobject"s right vector
     */
    public readonly RIGHT:     Vector3 = new Vector3(1, 0, 0);

    constructor(request: ITransform | Transform)
    {
        if (!request) request = new ITransform();
        this.Position = new Vector3(request.Position);
        this.Rotation = new Vector3(request.Rotation);
        this.Scale = new Vector3(request.Scale);
        this.Shear = new Vector3(request.Shear);
    }
    
    /**
     * @property    TransformUpdate: {undefined}
     * @description Updates the transformations
     */
    Update()
    {
        // TODO
        // UPDATE: UP, FORWARD, AND RIGHT
    }
}

/**
 * @name        Input
 * @description Input.module handles all user key and mouse inputs.
 * @module      FWGE.Game
 */
class Input
{
    private static UP_K:    number = 0;
    private static PRESS_K: number = 128;
    private static DOWN_K:  number = 256;
    private static END_K:   number = 384;
    private static Keys:    Array<boolean> = new Array<boolean>();

    private static UP_M:    number = 0;
    private static CLICK_M: number = 3;
    private static DOWN_M:  number = 6;
    private static WHEEL_U: number = 9;
    private static WHEEL_D: number = 10;
    private static END_M:   number = 11;
    private static Mouse:   Array<boolean> = new Array<boolean>();

    private static _X:      number = 0;
    private static _Y:      number = 1;
    private static CURR_A:  number = 0;
    private static PREV_A:  number = 2;
    private static DELTA_A: number = 4;
    private static END_A:   number = 8;
    private static Axis:    Array<number | undefined> = new Array<number | undefined>();
    
    private static handle_event(e: MouseEvent | PointerEvent | KeyboardEvent): number
    {
        var key = e instanceof MouseEvent ? e.button :  e.which || 0;
        
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;

        return key;
    }

    constructor(canvas: HTMLCanvasElement)
    {
        for (var i = 0; i < Input.PRESS_K; ++i)
            Input.Keys.push(true);

        for (var i = Input.PRESS_K; i < Input.END_K; ++i)
            Input.Keys.push(false);

        for (var i = 0; i < Input.CLICK_M; ++i)
            Input.Mouse.push(true);

        for (var i = Input.CLICK_M; i < Input.END_M; ++i)
            Input.Mouse.push(false);

        for (var i = 0; i < Input.END_A; ++i)
            Input.Axis.push(undefined);

        canvas.onkeyup = function onkeyup(e)
        {
            var key = Input.handle_event(e);

            Input.Keys[key + Input.UP_K]      = true;
            Input.Keys[key + Input.PRESS_K]   = false;
            Input.Keys[key + Input.DOWN_K]    = false;
        };
        canvas.onkeydown = function onkeydown(e)
        {
            var key = Input.handle_event(e);

            Input.Keys[key + Input.UP_K]      = false;
            Input.Keys[key + Input.PRESS_K]   = true;
            Input.Keys[key + Input.DOWN_K]    = true;
        };

        canvas.oncontextmenu = function oncontextmenu(e) { Input.handle_event(e); return false; };
        canvas.onmouseenter = function onmouseenter(e)
        {
            Input.Axis[Input._X + Input.PREV_A] = e.clientX;
            Input.Axis[Input._Y + Input.PREV_A] = e.clientY;
            
            Input.Axis[Input._X + Input.CURR_A] = e.clientX;
            Input.Axis[Input._Y + Input.CURR_A] = e.clientY;

            Input.Axis[Input._X + Input.DELTA_A] = 0;
            Input.Axis[Input._Y + Input.DELTA_A] = 0;
        };
        canvas.onmousemove = function onmousemove(e) 
        {
            if (!Input.Axis[Input._X + Input.CURR_A] || !Input.Axis[Input._Y + Input.CURR_A])
            {
                Input.Axis[Input._X + Input.CURR_A] = e.clientX;
                Input.Axis[Input._Y + Input.CURR_A] = e.clientY;
            }

            Input.Axis[Input._X + Input.PREV_A] = Input.Axis[Input._X + Input.CURR_A];
            Input.Axis[Input._Y + Input.PREV_A] = Input.Axis[Input._Y + Input.CURR_A];
            Input.Axis[Input._X + Input.CURR_A] = e.clientX;
            Input.Axis[Input._Y + Input.CURR_A] = e.clientY;

            Input.Axis[Input._X + Input.DELTA_A] = Input.Axis[Input._X + Input.CURR_A] - Input.Axis[Input._X + Input.PREV_A];
            Input.Axis[Input._Y + Input.DELTA_A] = Input.Axis[Input._Y + Input.CURR_A] - Input.Axis[Input._Y + Input.PREV_A];
        };
        canvas.onmouseleave = function onmouseleave(e)
        {
            Input.Axis[Input._X + Input.PREV_A] = undefined;
            Input.Axis[Input._Y + Input.PREV_A] = undefined;
            
            Input.Axis[Input._X + Input.CURR_A] = undefined;
            Input.Axis[Input._Y + Input.CURR_A] = undefined;

            Input.Axis[Input._X + Input.DELTA_A] = 0;
            Input.Axis[Input._Y + Input.DELTA_A] = 0;
        };
        canvas.onmouseup = function onmouseup(e)   
        {
            var key = Input.handle_event(e);

            Input.Mouse[key + Input.UP_M] = true;
            Input.Mouse[key + Input.CLICK_M] = false;
            Input.Mouse[key + Input.DOWN_M] = false;
        };
        canvas.onmousedown = function onmousedown(e) 
        {
            var key = Input.handle_event(e);

            Input.Mouse[key + Input.UP_M] = false;
            Input.Mouse[key + Input.CLICK_M] = true;
            Input.Mouse[key + Input.DOWN_M] = true;
        };
        canvas.onmousewheel = function onmousewheel(e)
        {
            Input.Mouse[e.deltaY < 0 ? Input.WHEEL_U : Input.WHEEL_D] = true;
        };
    }

    

    /**
     * @property    KEY_F1_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF1Up(): boolean
    {
        return Input.Keys[112 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F1_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF1Press(): boolean
    {
        return Input.Keys[112 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F1_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF1Down(): boolean
    {
        return Input.Keys[112 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F2_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF2Up(): boolean
    {
        return Input.Keys[113 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F2_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF2Press(): boolean
    {
        return Input.Keys[113 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F2_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF2Down(): boolean
    {
        return Input.Keys[113 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F3_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF3Up(): boolean
    {
        return Input.Keys[114 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F3_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF3Press(): boolean
    {
        return Input.Keys[114 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F3_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF3Down(): boolean
    {
        return Input.Keys[114 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F4_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF4Up(): boolean
    {
        return Input.Keys[115 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F4_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF4Press(): boolean
    {
        return Input.Keys[115 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F4_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF4Down(): boolean
    {
        return Input.Keys[115 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F5_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF5Up(): boolean
    {
        return Input.Keys[116 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F5_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF5Press(): boolean
    {
        return Input.Keys[116 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F5_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF5Down(): boolean
    {
        return Input.Keys[116 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F6_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF6Up(): boolean
    {
        return Input.Keys[117 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F6_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF6Press(): boolean
    {
        return Input.Keys[117 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F6_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF6Down(): boolean
    {
        return Input.Keys[117 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F7_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF7Up(): boolean
    {
        return Input.Keys[118 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F7_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF7Press(): boolean
    {
        return Input.Keys[118 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F7_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF7Down(): boolean
    {
        return Input.Keys[118 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F8_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF8Up(): boolean
    {
        return Input.Keys[119 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F8_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF8Press(): boolean
    {
        return Input.Keys[119 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F8_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF8Down(): boolean
    {
        return Input.Keys[119 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F9_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF9Up(): boolean
    {
        return Input.Keys[120 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F9_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF9Press(): boolean
    {
        return Input.Keys[120 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F9_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF9Down(): boolean
    {
        return Input.Keys[120 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F10_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF10Up(): boolean
    {
        return Input.Keys[121 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F10_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF10Press(): boolean
    {
        return Input.Keys[121 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F10_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF10Down(): boolean
    {
        return Input.Keys[121 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F11_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF11Up(): boolean
    {
        return Input.Keys[122 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F11_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF11Press(): boolean
    {
        return Input.Keys[122 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F11_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF11Down(): boolean
    {
        return Input.Keys[122 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F12_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyF12Up(): boolean
    {
        return Input.Keys[123 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F12_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyF12Press(): boolean
    {
        return Input.Keys[123 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F12_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyF12Down(): boolean
    {
        return Input.Keys[123 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_0_UP: {Boolean} [read]
     * @description Some description
     */
    get Key0Up(): boolean
    {
        return Input.Keys[48 + Input.UP_K];
    }
    
    /**
     * @property    KEY_0_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key0Press(): boolean
    {
        return Input.Keys[48 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_0_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key0Down(): boolean
    {
        return Input.Keys[48 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_1_UP: {Boolean} [read]
     * @description Some description
     */
    get Key1Up(): boolean
    {
        return Input.Keys[49 + Input.UP_K];
    }
    
    /**
     * @property    KEY_1_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key1Press(): boolean
    {
        return Input.Keys[49 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_1_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key1Down(): boolean
    {
        return Input.Keys[49 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_2_UP: {Boolean} [read]
     * @description Some description
     */
    get Key2Up(): boolean
    {
        return Input.Keys[50 + Input.UP_K];
    }
    
    /**
     * @property    KEY_2_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key2Press(): boolean
    {
        return Input.Keys[50 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_2_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key2Down(): boolean
    {
        return Input.Keys[50 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_3_UP: {Boolean} [read]
     * @description Some description
     */
    get Key3Up(): boolean
    {
        return Input.Keys[51 + Input.UP_K];
    }
    
    /**
     * @property    KEY_3_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key3Press(): boolean
    {
        return Input.Keys[51 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_3_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key3Down(): boolean
    {
        return Input.Keys[51 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_4_UP: {Boolean} [read]
     * @description Some description
     */
    get Key4Up(): boolean
    {
        return Input.Keys[52 + Input.UP_K];
    }
    
    /**
     * @property    KEY_4_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key4Press(): boolean
    {
        return Input.Keys[52 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_4_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key4Down(): boolean
    {
        return Input.Keys[52 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_5_UP: {Boolean} [read]
     * @description Some description
     */
    get Key5Up(): boolean
    {
        return Input.Keys[53 + Input.UP_K];
    }
    
    /**
     * @property    KEY_5_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key5Press(): boolean
    {
        return Input.Keys[53 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_5_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key5Down(): boolean
    {
        return Input.Keys[53 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_6_UP: {Boolean} [read]
     * @description Some description
     */
    get Key6Up(): boolean
    {
        return Input.Keys[54 + Input.UP_K];
    }
    
    /**
     * @property    KEY_6_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key6Press(): boolean
    {
        return Input.Keys[54 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_6_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key6Down(): boolean
    {
        return Input.Keys[54 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_7_UP: {Boolean} [read]
     * @description Some description
     */
    get Key7Up(): boolean
    {
        return Input.Keys[55 + Input.UP_K];
    }
    
    /**
     * @property    KEY_7_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key7Press(): boolean
    {
        return Input.Keys[55 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_7_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key7Down(): boolean
    {
        return Input.Keys[55 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_8_UP: {Boolean} [read]
     * @description Some description
     */
    get Key8Up(): boolean
    {
        return Input.Keys[56 + Input.UP_K];
    }
    
    /**
     * @property    KEY_8_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key8Press(): boolean
    {
        return Input.Keys[56 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_8_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key8Down(): boolean
    {
        return Input.Keys[56 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_9_UP: {Boolean} [read]
     * @description Some description
     */
    get Key9Up(): boolean
    {
        return Input.Keys[57 + Input.UP_K];
    }
    
    /**
     * @property    KEY_9_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Key9Press(): boolean
    {
        return Input.Keys[57 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_9_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Key9Down(): boolean
    {
        return Input.Keys[57 + Input.DOWN_K];
    }


    
    /**
     * @property    NUMPAD_0_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad0Up(): boolean
    {
        return Input.Keys[96 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_0_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad0Press(): boolean
    {
            return Input.Keys[96 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_0_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad0Down(): boolean
    {
        return Input.Keys[96 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_1_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad1Up(): boolean
    {
        return Input.Keys[97 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_1_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad1Press(): boolean
    {
        return Input.Keys[97 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_1_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad1Down(): boolean
    {
        return Input.Keys[97 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_2_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad2Up(): boolean
    {
        return Input.Keys[98 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_2_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad2Press(): boolean
    {
        return Input.Keys[98 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_2_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad2Down(): boolean
    {
        return Input.Keys[98 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_3_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad3Up(): boolean
    {
        return Input.Keys[99 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_3_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad3Press(): boolean
    {
        return Input.Keys[99 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_3_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad3Down(): boolean
    {
        return Input.Keys[99 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_4_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad4Up(): boolean
    {
        return Input.Keys[100 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_4_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad4Press(): boolean
    {
        return Input.Keys[100 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_4_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad4Down(): boolean
    {
        return Input.Keys[100 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_5_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad5Up(): boolean
    {
        return Input.Keys[101 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_5_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad5Press(): boolean
    {
        return Input.Keys[101 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_5_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad5Down(): boolean
    {
        return Input.Keys[101 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_6_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad6Up(): boolean
    {
        return Input.Keys[102 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_6_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad6Press(): boolean
    {
        return Input.Keys[102 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_6_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad6Down(): boolean
    {
        return Input.Keys[102 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_7_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad7Up(): boolean
    {
        return Input.Keys[103 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_7_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad7Press(): boolean
    {
        return Input.Keys[103 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_7_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad7Down(): boolean
    {
        return Input.Keys[103 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_8_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad8Up(): boolean
    {
        return Input.Keys[104 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_8_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad8Press(): boolean
    {
        return Input.Keys[104 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_8_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad8Down(): boolean
    {
        return Input.Keys[104 + Input.DOWN_K];
    }

    
    /**
     * @property    NUMPAD_9_UP: {Boolean} [read]
     * @description Some description
     */
    get Numpad9Up(): boolean
    {
        return Input.Keys[105 + Input.UP_K];
    }
    
    /**
     * @property    NUMPAD_9_PRESS: {Boolean} [read]
     * @description Some description
     */
    get Numpad9Press(): boolean
    {
        return Input.Keys[105 + Input.PRESS_K];
    }
    
    /**
     * @property    NUMPAD_9_DOWN: {Boolean} [read]
     * @description Some description
     */
    get Numpad9Down(): boolean
    {
        return Input.Keys[105 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_DIVIDE_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyDivideUp(): boolean
    {
        return Input.Keys[111 + Input.UP_K];
    }
    
    /**
     * @property    KEY_DIVIDE_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyDividePress(): boolean
    {
        return Input.Keys[111 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_DIVIDE_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyDivideDown(): boolean
    {
        return Input.Keys[111 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_MULTIPLY_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyMultiplyUp(): boolean
    {
        return Input.Keys[106 + Input.UP_K];
    }
    
    /**
     * @property    KEY_MULTIPLY_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyMultiplyPress(): boolean
    {
        return Input.Keys[106 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_MULTIPLY_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyMultiplyDown(): boolean
    {
        return Input.Keys[106 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_SUBTRACT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeySubtractUp(): boolean
    {
        return Input.Keys[109 + Input.UP_K];
    }
    
    /**
     * @property    KEY_SUBTRACT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeySubtractPress(): boolean
    {
        return Input.Keys[109 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_SUBTRACT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeySubtractDown(): boolean
    {
        return Input.Keys[109 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_ADD_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyAddUp(): boolean
    {
        return Input.Keys[107 + Input.UP_K];
    }
    
    /**
     * @property    KEY_ADD_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyAddPress(): boolean
    {
        return Input.Keys[107 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_ADD_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyAddDown(): boolean
    {
        return Input.Keys[107 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_TAB_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyTabUp(): boolean
    {
        return Input.Keys[9 + Input.UP_K];
    }
    
    /**
     * @property    KEY_TAB_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyTabPress(): boolean
    {
        return Input.Keys[9 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_TAB_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyTabDown(): boolean
    {
        return Input.Keys[9 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_CAPS_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyCapsUp(): boolean
    {
        return Input.Keys[20 + Input.UP_K];
    }
    
    /**
     * @property    KEY_CAPS_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyCapsPress(): boolean
    {
        return Input.Keys[20 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_CAPS_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyCapsDown(): boolean
    {
        return Input.Keys[20 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_SHIFT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyShiftUp(): boolean
    {
        return Input.Keys[16 + Input.UP_K];
    }
    
    /**
     * @property    KEY_SHIFT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyShiftPress(): boolean
    {
        return Input.Keys[16 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_SHIFT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyShiftDown(): boolean
    {
        return Input.Keys[16 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_CTRL_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyCtrlUp(): boolean
    {
        return Input.Keys[17 + Input.UP_K];
    }
    
    /**
     * @property    KEY_CTRL_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyCtrlPress(): boolean
    {
        return Input.Keys[17 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_CTRL_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyCtrlDown(): boolean
    {
        return Input.Keys[17 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_ALT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyAltUp(): boolean
    {
        return Input.Keys[18 + Input.UP_K];
    }
    
    /**
     * @property    KEY_ALT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyAltPress(): boolean
    {
        return Input.Keys[18 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_ALT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyAltDown(): boolean
    {
        return Input.Keys[18 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_BACKSPACE_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyBackspaceUp(): boolean
    {
        return Input.Keys[8 + Input.UP_K];
    }
    
    /**
     * @property    KEY_BACKSPACE_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyBackspacePress(): boolean
    {
        return Input.Keys[8 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_BACKSPACE_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyBackspaceDown(): boolean
    {
        return Input.Keys[8 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_ENTER_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyEnterUp(): boolean
    {
        return Input.Keys[13 + Input.UP_K];
    }
    
    /**
     * @property    KEY_ENTER_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyEnterPress(): boolean
    {
        return Input.Keys[13 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_ENTER_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyEnterDown(): boolean
    {
        return Input.Keys[13 + Input.DOWN_K];
    }


    
    /**
     * @property    KEY_UP_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyUpUp(): boolean
    {
        return Input.Keys[38 + Input.UP_K];
    }
    
    /**
     * @property    KEY_UP_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyUpPress(): boolean
    {
        return Input.Keys[38 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_UP_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyUpDown(): boolean
    {
        return Input.Keys[38 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_LEFT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyLeftUp(): boolean
    {
        return Input.Keys[37 + Input.UP_K];
    }
    
    /**
     * @property    KEY_LEFT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyLeftPress(): boolean
    {
        return Input.Keys[37 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_LEFT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyLeftDown(): boolean
    {
        return Input.Keys[37 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_RIGHT_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyRightUp(): boolean
    {
        return Input.Keys[39 + Input.UP_K];
    }
    
    /**
     * @property    KEY_RIGHT_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyRightPress(): boolean
    {
        return Input.Keys[39 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_RIGHT_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyRightDown(): boolean
    {
        return Input.Keys[39 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_DOWN_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyDownUp(): boolean
    {
        return Input.Keys[40 + Input.UP_K];
    }
    
    /**
     * @property    KEY_DOWN_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyDownPress(): boolean
    {
        return Input.Keys[40 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_DOWN_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyDownDown(): boolean
    {
        return Input.Keys[40 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_A_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyAUp(): boolean
    {
        return Input.Keys[65 + Input.UP_K];
    }
    
    /**
     * @property    KEY_A_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyAPress(): boolean
    {
        return Input.Keys[65 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_A_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyADown(): boolean
    {
        return Input.Keys[65 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_B_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyBUp(): boolean
    {
        return Input.Keys[66 + Input.UP_K];
    }
    
    /**
     * @property    KEY_B_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyBPress(): boolean
    {
        return Input.Keys[66 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_B_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyBDown(): boolean
    {
        return Input.Keys[66 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_C_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyCUp(): boolean
    {
        return Input.Keys[67 + Input.UP_K];
    }
    
    /**
     * @property    KEY_C_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyCPress(): boolean
    {
        return Input.Keys[67 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_C_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyCDown(): boolean
    {
        return Input.Keys[67 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_D_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyDUp(): boolean
    {
        return Input.Keys[68 + Input.UP_K];
    }
    
    /**
     * @property    KEY_D_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyDPress(): boolean
    {
        return Input.Keys[68 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_D_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyDDown(): boolean
    {
        return Input.Keys[68 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_E_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyEUp(): boolean
    {
        return Input.Keys[69 + Input.UP_K];
    }
    
    /**
     * @property    KEY_E_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyEPress(): boolean
    {
        return Input.Keys[69 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_E_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyEDown(): boolean
    {
        return Input.Keys[69 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_F_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyFUp(): boolean
    {
        return Input.Keys[70 + Input.UP_K];
    }
    
    /**
     * @property    KEY_F_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyFPress(): boolean
    {
        return Input.Keys[70 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_F_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyFDown(): boolean
    {
        return Input.Keys[70 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_G_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyGUp(): boolean
    {
        return Input.Keys[71 + Input.UP_K];
    }
    
    /**
     * @property    KEY_G_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyGPress(): boolean
    {
        return Input.Keys[71 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_G_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyGDown(): boolean
    {
        return Input.Keys[71 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_H_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyHUp(): boolean
    {
        return Input.Keys[72 + Input.UP_K];
    }
    
    /**
     * @property    KEY_H_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyHPress(): boolean
    {
        return Input.Keys[72 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_H_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyHDown(): boolean
    {
        return Input.Keys[72 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_I_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyIUp(): boolean
    {
        return Input.Keys[73 + Input.UP_K];
    }
    
    /**
     * @property    KEY_I_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyIPress(): boolean
    {
        return Input.Keys[73 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_I_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyIDown(): boolean
    {
        return Input.Keys[73 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_J_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyJUp(): boolean
    {
        return Input.Keys[74 + Input.UP_K];
    }
    
    /**
     * @property    KEY_J_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyJPress(): boolean
    {
        return Input.Keys[74 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_J_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyJDown(): boolean
    {
        return Input.Keys[74 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_K_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyKUp(): boolean
    {
        return Input.Keys[75 + Input.UP_K];
    }
    
    /**
     * @property    KEY_K_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyKPress(): boolean
    {
        return Input.Keys[75 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_K_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyKDown(): boolean
    {
        return Input.Keys[75 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_L_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyLUp(): boolean
    {
        return Input.Keys[76 + Input.UP_K];
    }
    
    /**
     * @property    KEY_L_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyLPress(): boolean
    {
        return Input.Keys[76 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_L_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyLDown(): boolean
    {
        return Input.Keys[76 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_M_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyMUp(): boolean
    {
        return Input.Keys[77 + Input.UP_K];
    }
    
    /**
     * @property    KEY_M_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyMPress(): boolean
    {
        return Input.Keys[77 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_M_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyMDown(): boolean
    {
        return Input.Keys[77 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_N_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyNUp(): boolean
    {
        return Input.Keys[78 + Input.UP_K];
    }
    
    /**
     * @property    KEY_N_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyNPress(): boolean
    {
        return Input.Keys[78 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_N_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyNDown(): boolean
    {
        return Input.Keys[78 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_O_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyOUp(): boolean
    {
        return Input.Keys[79 + Input.UP_K];
    }
    
    /**
     * @property    KEY_O_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyOPress(): boolean
    {
        return Input.Keys[79 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_O_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyODown(): boolean
    {
        return Input.Keys[79 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_P_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyPUp(): boolean
    {
        return Input.Keys[80 + Input.UP_K];
    }
    
    /**
     * @property    KEY_P_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyPPress(): boolean
    {
        return Input.Keys[80 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_P_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyPDown(): boolean
    {
        return Input.Keys[80 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_Q_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyQUp(): boolean
    {
        return Input.Keys[81 + Input.UP_K];
    }
    
    /**
     * @property    KEY_Q_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyQPress(): boolean
    {
        return Input.Keys[81 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_Q_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyQDown(): boolean
    {
        return Input.Keys[81 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_R_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyRUp(): boolean
    {
        return Input.Keys[82 + Input.UP_K];
    }
    
    /**
     * @property    KEY_R_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyRPress(): boolean
    {
        return Input.Keys[82 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_R_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyRDown(): boolean
    {
        return Input.Keys[82 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_S_UP: {Boolean} [read]
     * @description Some description
     */
    get KeySUp(): boolean
    {
        return Input.Keys[83 + Input.UP_K];
    }
    
    /**
     * @property    KEY_S_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeySPress(): boolean
    {
        return Input.Keys[83 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_S_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeySDown(): boolean
    {
        return Input.Keys[83 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_T_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyTUp(): boolean
    {
        return Input.Keys[84 + Input.UP_K];
    }
    
    /**
     * @property    KEY_T_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyTPress(): boolean
    {
        return Input.Keys[84 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_T_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyTDown(): boolean
    {
        return Input.Keys[84 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_U_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyUUp(): boolean
    {
        return Input.Keys[85 + Input.UP_K];
    }
    
    /**
     * @property    KEY_U_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyUPress(): boolean
    {
        return Input.Keys[85 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_U_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyUDown(): boolean
    {
        return Input.Keys[85 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_V_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyVUp(): boolean
    {
        return Input.Keys[86 + Input.UP_K];
    }
    
    /**
     * @property    KEY_V_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyVPress(): boolean
    {
        return Input.Keys[86 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_V_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyVDown(): boolean
    {
        return Input.Keys[86 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_W_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyWUp(): boolean
    {
        return Input.Keys[87 + Input.UP_K];
    }
    
    /**
     * @property    KEY_W_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyWPress(): boolean
    {
        return Input.Keys[87 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_W_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyWDown(): boolean
    {
        return Input.Keys[87 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_X_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyXUp(): boolean
    {
        return Input.Keys[88 + Input.UP_K];
    }
    
    /**
     * @property    KEY_X_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyXPress(): boolean
    {
        return Input.Keys[88 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_X_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyXDown(): boolean
    {
        return Input.Keys[88 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_Y_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyYUp(): boolean
    {
        return Input.Keys[89 + Input.UP_K];
    }
    
    /**
     * @property    KEY_Y_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyYPress(): boolean
    {
        return Input.Keys[89 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_Y_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyYDown(): boolean
    {
        return Input.Keys[89 + Input.DOWN_K];
    }

    
    /**
     * @property    KEY_Z_UP: {Boolean} [read]
     * @description Some description
     */
    get KeyZUp(): boolean
    {
        return Input.Keys[90 + Input.UP_K];
    }
    
    /**
     * @property    KEY_Z_PRESS: {Boolean} [read]
     * @description Some description
     */
    get KeyZPress(): boolean
    {
        return Input.Keys[90 + Input.PRESS_K];
    }
    
    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get KeyZDown(): boolean
    {
        return Input.Keys[90 + Input.DOWN_K];
    }
    


    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseLeftUp(): boolean
    {
        return Input.Mouse[0 + Input.UP_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseLeftClick(): boolean
    {
        return Input.Mouse[0 + Input.CLICK_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseLeftDown(): boolean
    {
        return Input.Mouse[0 + Input.DOWN_M];
    }


    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseMiddleUp(): boolean
    {
        return Input.Mouse[1 + Input.UP_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseMiddleClick(): boolean
    {
        return Input.Mouse[1 + Input.CLICK_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseMiddleDown(): boolean
    {
        return Input.Mouse[1 + Input.DOWN_M];
    }


    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseRightUp(): boolean
    {
        return Input.Mouse[2 + Input.UP_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseRightClick(): boolean
    {
        return Input.Mouse[2 + Input.CLICK_M];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseRightDown(): boolean
    {
        return Input.Mouse[2 + Input.DOWN_M];
    }




    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseX(): number | undefined
    {
        return Input.Axis[Input._X + Input.CURR_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseY(): number | undefined
    {
        return Input.Axis[Input._Y + Input.CURR_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseDeltaX(): number | undefined
    {
        return Input.Axis[Input._X + Input.DELTA_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseDeltaY(): number | undefined
    {
        return Input.Axis[Input._Y + Input.DELTA_A];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseWheelUp(): boolean
    {
        return Input.Mouse[Input.WHEEL_U];
    }

    /**
     * @property    KEY_Z_DOWN: {Boolean} [read]
     * @description Some description
     */
    get MouseWheelDown(): boolean
    {
        return Input.Mouse[Input.WHEEL_D];
    }


    public InputUpdate()
    {
        for (var i = Input.PRESS_K; i < Input.DOWN_K; ++i)
            if (Input.Keys[i])
                Input.Keys[i] = false;

        for (var i = Input.CLICK_M; i < Input.DOWN_M; ++i)
            if (Input.Mouse[i])
                Input.Mouse[i] = false;

        Input.Axis[Input._X + Input.DELTA_A] = 0;
        Input.Axis[Input._Y + Input.DELTA_A] = 0;
        Input.Mouse[Input.WHEEL_U] = false;
        Input.Mouse[Input.WHEEL_D] = false;
    }
}

/**
 * @name        Time
 * @description This is the running clock that keeps track of elapsed time
 *              between render frames.
 * @module      FWGE.Game
 */
class Time
{
    private now:    number | undefined;
    private then:   number | undefined;
    
    /**
     * @property    Delta: {Number} [read]
     * @description Some description
     */
    get Delta(): number
    {
        if (this.now && this.then)
            return (this.now - this.then) / 60;
        return 0;
    }

    /**
     * @property    DeltaTime: {Number} [read]
     * @description Some description
     */
    get DeltaTime(): number
    {
        if (this.now && this.then)
            return this.now - this.then;
        return 0;
    }

    /**
     * @property    Now: {Date} [read]
     * @description Some description
     */
    get Now(): Date
    {
        return new Date(Date.now());
    }

    /**
     * @property    TimeUpdate: {undefined}
     * @description Some description
     */
    Update(): void
    {
        if (!this.now && !this.then)
            this.now = this.then = Date.now();
        else
        {
            this.then = this.now;
            this.now = Date.now();
        }
    }

    Reset(): void
    {
        this.now = this.then = undefined;
    }
}




interface IAnimationFrame<T> extends IKeyFrame<T> { }

class AnimationFrame<T> extends KeyFrame<T>
{
    constructor(request: IAnimationFrame<T>)
    {
        super(request);
    }
}




interface IColourAnimationFrame extends IAnimationFrame<Colour> { }

class ColourAnimationFrame extends AnimationFrame<Colour>
{
    constructor(request: IColourAnimationFrame)
    {
        super(request);
    }
}




interface ITransformAnimationFrame extends IAnimationFrame<Transform> { }

class TransformAnimationFrame extends AnimationFrame<Transform>
{
    constructor(request: ITransformAnimationFrame)
    {
        super(request);
    }
}




class IAnimation
{
    public Name: string | undefined;
    public GameObject: GameObject | null | undefined;
}

class Animation extends GameItem
{
    constructor({Name = "Animation", GameObject = null}: IAnimation)
    {
        super(Name, GameObject);
    }

    public Update(): void { }
}




enum CameraMode { PERSPECTIVE, ORTHOGRAPHIC }

/**
 * @name        Camera
 * @description Something...
 * @module      FWGE.Game
 */
class Camera
{
    public Transform:   Transform;
    public Mode:        CameraMode = CameraMode.PERSPECTIVE;

    public FOV:         number = 35;
    public Aspect:      number = 16/9;
    public Near:        number = 0.1;
    public Far:         number = 900;
    public Left:        number = -10;
    public Right:       number = 10;
    public Top:         number = 10;
    public Bottom:      number = 10;
    public Theta:       number = 90;
    public Phi:         number = 90;
    
    constructor() { }
    
    public Update()
    {
        if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
        {
            FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
            FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
        }
        
        this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;
    }
}




interface IViewer
{
    Position:  Vector3;
    Target:    Vector3;
}

class Viewer
{
    public Position:    Vector3 = Vector3.Zero;
    public Target:      Vector3 = Vector3.Zero;
    public Matrix:      Matrix4 = Matrix4.Identity;

    private Direction:  Vector3 = Vector3.Zero;
    private Up:         Vector3 = Vector3.Zero;
    private Right:      Vector3 = Vector3.Zero;

    constructor({Position = Vector3.Zero, Target = Vector3.Zero}: IViewer)
    {
        this.Position = Position;
        this.Target = Target;
    }

    public Update(): void
    {
        this.Direction.Set(this.Position).Diff(this.Target).Unit();
        this.Right.Set(this.Up).Cross(this.Direction).Unit();
        this.Up.Set(this.Direction).Cross(this.Right).Unit();

        this.Matrix.Set(
        [
            this.Right.X,       this.Right.Y,       this.Right.Z,       0,
            this.Up.X,          this.Up.Y,          this.Up.Z,          0,
            this.Direction.X,   this.Direction.Y,   this.Direction.Z,   0,
            0,                  0,                  0,                  1
        ]).Mult(
        [
            1,                  0,                  0,                  0,
            0,                  1,                  0,                  0,
            0,                  0,                  1,                  0,
            this.Position.X,    this.Position.Y,    this.Position.Z,    1
        ]);
    }
}





interface ILightItem
{
    Name:       string;
    Parent:     GameObject;
    Paint:      number[];
    Intensity:  number;
}

class LightItem extends GameItem
{
    public Colour: Colour;
    public Intensity: number;

    constructor({Name = "Light Item", Parent = new GameObject(), Paint = [1, 1, 1, 1], Intensity = 1.0}: ILightItem)
    {
        super(Name, Parent);

        this.Colour = new Colour(Paint);
        this.Intensity = Intensity;
    }
}




interface IAmbientLight extends ILightItem { }

class AmbientLight extends LightItem
{
    constructor({Name = "Ambient Light", Parent, Paint, Intensity}: IAmbientLight)
    {
        super({Name, Parent, Paint, Intensity});
    }
}




interface IDirectionalLight extends ILightItem
{
    Direction: Vector3;
}

class DirectionalLight extends LightItem
{
    public Direction: Vector3;

    constructor({Direction = Vector3.One, Paint, Intensity, Name, Parent}: IDirectionalLight)
    {
        super({Name, Parent, Paint, Intensity});
        this.Direction = Direction;
    }
}




interface IPointLight extends ILightItem
{ 
    Radius:    number; 
    Angle:     number; 
    Shininess: number;
}

class PointLight extends LightItem
{
    public Radius: number;
    public Angle: number;
    public Shininess: number;

    constructor({Name, Parent, Paint, Intensity, Radius = 5, Angle = 180, Shininess = 255}: IPointLight)
    {
        super({Name, Parent, Paint, Intensity});
        
        this.Radius = Radius;
        this.Angle = Angle;
        this.Shininess = Shininess;
    }    
}






class Light
{
    private AmbientCount:       number = 0;
    private DirectionalCount:   number = 0;
    private PointCount:         number = 0;
    
    private MAX_AMBIENT:        number = 1;
    private MAX_DIRECTIONAL:    number = 3;
    private MAX_POINT:          number = 8;
    private MAX_LIGHTS:         number = 12;

    public static Lights:       Array<LightItem | null> = new Array();

    constructor()
    {
        for (var i = 0; i < this.MAX_LIGHTS; ++i)
            Light.Lights.push(null);
    }
    
    public Ambient(request: IAmbientLight): AmbientLight | null
    {
        var light = null;

        if (this.AmbientCount < this.MAX_AMBIENT)
        {
            light = new AmbientLight(request);
            light.GameObject.Light = light;
            
            this.AmbientCount++;
            Light.Lights[0] = light;
        }

        return light;
    }
    
    public Directional(request: IDirectionalLight): DirectionalLight | null
    {
        var light = null;

        if (this.DirectionalCount < this.MAX_DIRECTIONAL)
        {
            for (var i = this.MAX_AMBIENT; i < this.MAX_DIRECTIONAL; ++i)
            {
                if (!Light.Lights[i])
                {
                    light = new DirectionalLight(request);
                    light.GameObject.Light = light;

                    this.DirectionalCount++;
                    Light.Lights[i] = light;

                    break;
                }
            }
        }

        return light;
    }
    
    public Point(request: IPointLight): PointLight | null
    {
        var light = null;

        if (this.PointCount < this.MAX_POINT)
        {
            for (var i = this.MAX_DIRECTIONAL; i < this.MAX_LIGHTS; ++i)
            {
                if (!Light.Lights[i])
                {
                    light = new PointLight(request);
                    light.GameObject.Light = light;

                    this.PointCount++;
                    Light.Lights[i] = light;

                    break;
                }
            }
        }

        return light
    }
    
    public Remove(light: LightItem): void
    {
        for (var i in  Light.Lights)
            if (!!Light.Lights[i] && light.ID === Light.Lights[i].ID)
                Light.Lights[i] = null;
    }
}

/**
 * @name        Matrix2
 * @description This library contains the methods for 2x2 matrix operations.
 *              2x2 matrices are represented as a Float32Array of length 4.
 * @module      FWGE.Game.Maths 
 */
class Matrix2
{
    public Buffer: Float32Array;
    public get M11():   number  { return this.Buffer[0]; }
    public set M11(m11: number) { this.Buffer[0] = m11;  }
    public get M12():   number  { return this.Buffer[1]; }
    public set M12(m12: number) { this.Buffer[1] = m12;  }
    public get M21():   number  { return this.Buffer[2]; }
    public set M21(m21: number) { this.Buffer[2] = m21;  }
    public get M22():   number  { return this.Buffer[3]; }
    public set M22(m22: number) { this.Buffer[3] = m22;  }

    public static get Identity(): Matrix2 { return new Matrix2().Identity(); }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0,
                    0, 0];

        if (args instanceof Matrix2)
            return [args.M11, args.M12,
                    args.M21, args.M22];

        else if ((args instanceof Float32Array && args.length >= 4) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
            return args;

        return Matrix2.GetArgs(args[0]);
    }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       m11:    {Number}        [null, override: 2]
     * @param       m12:    {Number}        [null, override: 2]
     * @param       m21:    {Number}        [null, override: 2]
     * @param       m22:    {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "MATRIX2".
     *              It also has the appropriate value indexers:
     *              M11, M12,
     *              M21, M22
     */
    constructor()
    {
        this.Buffer = new Float32Array(4);
    }

    /**
     * @function    Set:    {Float32Array}
     * @param       array1: {Float32Array}  [override: 1]
     * @param       array2: {Float32Array}  [override: 1]
     * @param       array:  {Float32Array}  [override: 2]
     * @param       m11:    {Number}        [override: 2]
     * @param       m12:    {Number}        [override: 2]
     * @param       m21:    {Number}        [override: 2]
     * @param       m22:    {Number}        [override: 2]
     * @description Assigns new to the a given Float32Array.
     */
    public Set(matrix: Matrix2): Matrix2;
    public Set(array: Float32Array): Matrix2;
    public Set(array: number[]): Matrix2;
    public Set(m11: number, m12: number, m21: number, m22: number): Matrix2;
    public Set(...args: any[]): Matrix2
    {
        let [m11, m12,
             m21, m22] = Matrix2.GetArgs(args);

        this.M11 = m11; this.M12 = m12;
        this.M21 = m21; this.M22 = m22;

        return this;
    }
    
    /**
     * @function    Transpose:  {Float32Array}
     * @param       array:      {Float32Array}
     * @description Transposes a matrix.
     */
    public Transpose(): Matrix2
    {
        return this.Set(this.M11, this.M21,
                        this.M12, this.M22);
    }
    
    /**
     * @function    Identity:   {Float32Array}
     * @param       array:      {Float32Array}
     * @description If given a Float32Array, it resets it to an identity matrix.
     *              If not, it simply returns a new identity matrix.
     */
    public Identity(): Matrix2
    {
        return this.Set(1, 0,
                        0, 1);
    }
    
    /**
     * @function    Determinant:    {Number}
     * @param       array:          {Float32Array}
     * @description Calculates the determinant of a given Float32Array.
     */
    public get Determinant(): number
    {
        return this.M11 * this.M22 - this.M21 * this.M12;
    }
    
    /**
     * @function    Inverse:    {Float32Array}
     * @param       array:      {Float32Array}
     * @description Inverts a given Float32Array when possible i.e. the determinant
     *              is not 0.
     */
    public Inverse(): Matrix2
    {
        let det = this.Determinant;

        if (det !== 0)
            this.Set(this.M22 / det, -this.M12 / det,
                    -this.M21 / det,  this.M11 / det);

        return this;
    }
    
    /**
     * @function    Sum:        {Float32Array}
     * @param       array1:     {Float32Array}
     * @param       array2:     {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(matrix: Matrix2): Matrix2;
    public Sum(array: Float32Array): Matrix2;
    public Sum(array: number[]): Matrix2;
    public Sum(m11: number, m12: number, m21: number, m22: number): Matrix2;
    public Sum(...args: any[]): Matrix2
    {
        let [m11, m12, m21, m22] = Matrix2.GetArgs(args);

        return this.Set(this.M11 + m11, this.M12 + m12,
                        this.M21 + m21, this.M22 + m22);
    }
    
    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override 1]
     * @param       array2:     {Float32Array}  [override 1]
     * @param       array:      {Float32Array}  [override 2]
     * @param       constant:   {Number}        [override 2]
     * @description Performs a matrix multiplication on two Float32Array or
     *              multiply a Float32Array with a scalar value.
     */
    public Mult(matrix: Matrix2): Matrix2;
    public Mult(array: Float32Array): Matrix2;
    public Mult(array: number[]): Matrix2;
    public Mult(m11: number, m12: number, m21: number, m22: number): Matrix2;
    public Mult(...args: any[]): Matrix2
    {
        let [m11, m12, m21, m22] = Matrix2.GetArgs(args);

        return this.Set
        (
            this.M11 * m11 + this.M12 * m21,
            this.M11 * m12 + this.M12 * m22,
            
            this.M21 * m11 + this.M22 * m21,
            this.M21 * m12 + this.M22 * m22
        );
    }
    
    public Scale(scaler: number): Matrix2
    {
        return this.Set(this.M11 * scaler, this.M12 * scaler,
                        this.M21 * scaler, this.M22 * scaler);
    }
}

/**
 * @name Matrix3
 * @description This library contains the methods for 3x3 matrix operations.
 *              3x3 matrices are represented as a Float32Array of length 9.
 * @module      FWGE.Game.Maths 
 */
class Matrix3
{
    public readonly Buffer: Float32Array;
    public get M11():   number  { return this.Buffer[0]; }
    public set M11(m11: number) { this.Buffer[0] = m11;  }
    public get M12():   number  { return this.Buffer[1]; }
    public set M12(m12: number) { this.Buffer[1] = m12;  }
    public get M13():   number  { return this.Buffer[2]; }
    public set M13(m13: number) { this.Buffer[2] = m13;  }
    public get M21():   number  { return this.Buffer[3]; }
    public set M21(m21: number) { this.Buffer[3] = m21;  }
    public get M22():   number  { return this.Buffer[4]; }
    public set M22(m22: number) { this.Buffer[4] = m22;  }
    public get M23():   number  { return this.Buffer[5]; }
    public set M23(m23: number) { this.Buffer[5] = m23;  }
    public get M31():   number  { return this.Buffer[6]; }
    public set M31(m31: number) { this.Buffer[6] = m31;  }
    public get M32():   number  { return this.Buffer[7]; }
    public set M32(m32: number) { this.Buffer[7] = m32;  }
    public get M33():   number  { return this.Buffer[8]; }
    public set M33(m33: number) { this.Buffer[8] = m33;  }

    public static get Identity(): Matrix3 { return new Matrix3().Identity(); }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0, 0,
                    0, 0, 0,
                    0, 0, 0];
        if (args instanceof Matrix3)
            return [args.M11, args.M12, args.M13,
                    args.M21, args.M22, args.M23,
                    args.M31, args.M32, args.M33];

        else if ((args instanceof Float32Array && args.length >= 9) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && 
                 typeof args[3] === "number" && typeof args[4] === "number" && typeof args[5] === "number" && 
                 typeof args[6] === "number" && typeof args[7] === "number" && typeof args[8] === "number"))
            return args;

        return Matrix3.GetArgs(args[0]);
    }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       m11:    {Number}        [null, override: 2]
     * @param       m12:    {Number}        [null, override: 2]
     * @param       m13:    {Number}        [null, override: 2]
     * @param       m21:    {Number}        [null, override: 2]
     * @param       m22:    {Number}        [null, override: 2]
     * @param       m23:    {Number}        [null, override: 2]
     * @param       m31:    {Number}        [null, override: 2]
     * @param       m32:    {Number}        [null, override: 2]
     * @param       m33:    {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "MATRIX3".
     *              It also has the appropriate value indexers:
     *              M11, M12, M13
     *              M21, M22, M23,
     *              M31, M32, M33
     */
    constructor()
    {
        this.Buffer = new Float32Array(9);
    }
    
        
    /**
     * @function    Set:    {Float32Array}
     * @param       array1: {Float32Array}  [override: 1]
     * @param       array2: {Float32Array}  [override: 1]
     * @param       array:  {Float32Array}  [override: 2]
     * @param       m11:    {Number}        [override: 2]
     * @param       m12:    {Number}        [override: 2]
     * @param       m13:    {Number}        [override: 2]
     * @param       m21:    {Number}        [override: 2]
     * @param       m22:    {Number}        [override: 2]
     * @param       m23:    {Number}        [override: 2]
     * @param       m31:    {Number}        [override: 2]
     * @param       m32:    {Number}        [override: 2]
     * @param       m33:    {Number}        [override: 2]
     * @description Assigns new to the a given Float32Array.
     */
    Set(matrix: Matrix3): Matrix3
    Set(array: Float32Array): Matrix3
    Set(array: number[]): Matrix3
    Set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Set(...args: any[]): Matrix3
    {         
        let [m11, m12, m13,
             m21, m22, m23,
             m31, m32, m33] = Matrix3.GetArgs(args);

        this.M11 = m11; this.M12 = m12; this.M13 = m13;
        this.M21 = m21; this.M22 = m22; this.M23 = m23;
        this.M31 = m31; this.M32 = m32; this.M33 = m33;

        return this;
    }
    
    /**
     * @function    Transpose:  {Float32Array}
     * @param       array:      {Float32Array}
     * @description Transposes a matrix.
     */
    Transpose(): Matrix3
    {
        return this.Set(this.M11, this.M21, this.M31,
                        this.M12, this.M22, this.M32,
                        this.M13, this.M23, this.M33);
    }
    
    /**
     * @function    Identity:   {Float32Array}
     * @param       array:      {Float32Array}
     * @description If given a Float32Array, it resets it to an identity matrix.
     *              If not, it simply returns a new identity matrix.
     */
    Identity(): Matrix3
    {
        return this.Set(1, 0, 0,
                        0, 1, 0,
                        0, 0, 1);
    }

    /**
     * @function    Determinant:    {Number}
     * @param       array:          {Float32Array}
     * @description Calculates the determinant of a given Float32Array.
     */
    get Determinant(): number
    {
        return  this.M11 * (this.M22 * this.M33 - this.M23 * this.M32) -
                this.M12 * (this.M21 * this.M33 - this.M23 * this.M31) + 
                this.M13 * (this.M21 * this.M32 - this.M22 * this.M31);
    }
    
    /**
     * @function    Inverse:    {Float32Array}
     * @param       array:      {Float32Array}
     * @description Inverts a given Float32Array when possible i.e. the determinant
     *              is not 0.
     */
    Inverse(): Matrix3
    {
        let det = this.Determinant;

        if (det !== 0)
            this.Set((this.M22 * this.M33 - this.M32 * this.M23) / det,
                    -(this.M12 * this.M33 - this.M32 * this.M13) / det,
                     (this.M12 * this.M23 - this.M22 * this.M13) / det,

                    -(this.M21 * this.M33 - this.M31 * this.M23) / det,
                     (this.M11 * this.M33 - this.M31 * this.M13) / det,
                    -(this.M11 * this.M23 - this.M21 * this.M13) / det,

                     (this.M21 * this.M32 - this.M31 * this.M22) / det,
                    -(this.M11 * this.M32 - this.M31 * this.M12) / det,
                     (this.M11 * this.M22 - this.M21 * this.M12) / det);
    
        return this;
    }
    
    /**
     * @function    Sum:        {Float32Array}
     * @param       array1:     {Float32Array}
     * @param       array2:     {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    Sum(matrix: Matrix3): Matrix3;
    Sum(array: Float32Array): Matrix3;
    Sum(array: number[]): Matrix3;
    Sum(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3;
    Sum(...args: any[]): Matrix3
    {
        let[m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.GetArgs(args);
    
        return this.Set(this.M11 + m11, this.M12 + m12, this.M13 + m13,
                        this.M21 + m21, this.M22 + m22, this.M23 + m23,
                        this.M31 + m31, this.M32 + m32, this.M33 + m33);
    }
    
    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override 1]
     * @param       array2:     {Float32Array}  [override 1]
     * @param       array:      {Float32Array}  [override 2]
     * @param       constant:   {Number}        [override 2]
     * @description Performs a matrix multiplication on two Float32Array or
     *              multiply a Float32Array with a scalar value.
     */
    Mult(matrix: Matrix3): Matrix3
    Mult(array: Float32Array): Matrix3
    Mult(array: number[]): Matrix3
    Mult(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Matrix3
    Mult(...args: any[])
    {
        let[m11, m12, m13, m21, m22, m23, m31, m32, m33] = Matrix3.GetArgs(args);
    
        return this.Set
        (
            this.M11 * m11 + this.M12 * m21 + this.M13 * m31,
            this.M11 * m12 + this.M12 * m22 + this.M13 * m32,
            this.M11 * m13 + this.M12 * m23 + this.M13 * m33,
            
            this.M21 * m11 + this.M22 * m21 + this.M23 * m31,
            this.M21 * m12 + this.M22 * m22 + this.M23 * m32,
            this.M21 * m13 + this.M22 * m23 + this.M23 * m33,
            
            this.M31 * m11 + this.M32 * m21 + this.M33 * m31,
            this.M31 * m12 + this.M32 * m22 + this.M33 * m32,
            this.M31 * m13 + this.M32 * m23 + this.M33 * m33
        ); 
    }

    Scale(scaler: number): Matrix3
    {
        return this.Set(this.M11 * scaler, this.M12 * scaler, this.M13 * scaler,
                        this.M21 * scaler, this.M22 * scaler, this.M23 * scaler,
                        this.M31 * scaler, this.M32 * scaler, this.M33 * scaler);
    }
}

/**
 * @name        Matrix4
 * @description This library contains the methods for 2x2 matrix operations.
 *              4x4 matrices are represented as a Float32Array of length 16.
 * @module      FWGE.Game.Maths 
 */
class Matrix4
{
    public readonly Buffer: Float32Array;
    public get M11():   number  { return this.Buffer[0];  }
    public set M11(m11: number) { this.Buffer[0] = m11;   }
    public get M12():   number  { return this.Buffer[1];  }
    public set M12(m12: number) { this.Buffer[1] = m12;   }
    public get M13():   number  { return this.Buffer[2];  }
    public set M13(m13: number) { this.Buffer[2] = m13;   }
    public get M14():   number  { return this.Buffer[3];  }
    public set M14(m14: number) { this.Buffer[3] = m14;   }
    public get M21():   number  { return this.Buffer[4];  }
    public set M21(m21: number) { this.Buffer[4] = m21;   }
    public get M22():   number  { return this.Buffer[5];  }
    public set M22(m22: number) { this.Buffer[5] = m22;   }
    public get M23():   number  { return this.Buffer[6];  }
    public set M23(m23: number) { this.Buffer[6] = m23;   }
    public get M24():   number  { return this.Buffer[7];  }
    public set M24(m24: number) { this.Buffer[7] = m24;   }
    public get M31():   number  { return this.Buffer[8];  }
    public set M31(m31: number) { this.Buffer[8] = m31;   }
    public get M32():   number  { return this.Buffer[9];  }
    public set M32(m32: number) { this.Buffer[9] = m32;   }
    public get M33():   number  { return this.Buffer[10]; }
    public set M33(m33: number) { this.Buffer[10] = m33;  }
    public get M34():   number  { return this.Buffer[11]; }
    public set M34(m34: number) { this.Buffer[11] = m34;  }
    public get M41():   number  { return this.Buffer[12]; }
    public set M41(m41: number) { this.Buffer[12] = m41;  }
    public get M42():   number  { return this.Buffer[13]; }
    public set M42(m42: number) { this.Buffer[13] = m42;  }
    public get M43():   number  { return this.Buffer[14]; }
    public set M43(m43: number) { this.Buffer[14] = m43;  }
    public get M44():   number  { return this.Buffer[15]; }
    public set M44(m44: number) { this.Buffer[15] = m44;  }

    public static get Identity(): Matrix4 { return (new Matrix4()).Identity(); }

    private static GetArgs(args: any): number[]
    {
        if (!args)
            return [0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0];

        if (args instanceof Matrix4)
            return [args.M11, args.M12, args.M13, args.M14,
                    args.M21, args.M22, args.M23, args.M24,
                    args.M31, args.M32, args.M33, args.M34,
                    args.M41, args.M42, args.M43, args.M44];

        else if ((args instanceof Float32Array && args.length >= 16) || 
                (typeof args[0]  === "number" && typeof args[1]  === "number" && typeof args[2]  === "number" && typeof args[3]  === "number" &&
                 typeof args[4]  === "number" && typeof args[5]  === "number" && typeof args[6]  === "number" && typeof args[7]  === "number" &&
                 typeof args[8]  === "number" && typeof args[9]  === "number" && typeof args[10] === "number" && typeof args[11] === "number" &&
                 typeof args[12] === "number" && typeof args[13] === "number" && typeof args[14] === "number" && typeof args[15] === "number"))
            return args;

        return Matrix4.GetArgs(args[0]);

    }

    /**
     * @function    Create: {Float32Array}
     * @param       array:  {Float32Array}  [null, override: 1]
     * @param       m11:    {Number}        [null, override: 2]
     * @param       m12:    {Number}        [null, override: 2]
     * @param       m13:    {Number}        [null, override: 2]
     * @param       m14:    {Number}        [null, override: 2]
     * @param       m21:    {Number}        [null, override: 2]
     * @param       m22:    {Number}        [null, override: 2]
     * @param       m23:    {Number}        [null, override: 2]
     * @param       m24:    {Number}        [null, override: 2]
     * @param       m31:    {Number}        [null, override: 2]
     * @param       m32:    {Number}        [null, override: 2]
     * @param       m33:    {Number}        [null, override: 2]
     * @param       m34:    {Number}        [null, override: 2]
     * @param       m41:    {Number}        [null, override: 2]
     * @param       m42:    {Number}        [null, override: 2]
     * @param       m43:    {Number}        [null, override: 2]
     * @param       m44:    {Number}        [null, override: 2]
     * @description Creates an new Float32Array with the Type set to "MATRIX4".
     *              It also has the appropriate value indexers:
     *              M11, M12,
     *              M21, M22
     */
    constructor()
    {
        this.Buffer = new Float32Array(16);
    }
    
    /**
     * @function    Set:    {Float32Array}
     * @param       array1: {Float32Array}  [override: 1]
     * @param       array2: {Float32Array}  [override: 1]
     * @param       array:  {Float32Array}  [override: 2]
     * @param       m11:    {Number}        [override: 2]
     * @param       m12:    {Number}        [override: 2]
     * @param       m13:    {Number}        [override: 2]
     * @param       m14:    {Number}        [override: 2]
     * @param       m21:    {Number}        [override: 2]
     * @param       m22:    {Number}        [override: 2]
     * @param       m23:    {Number}        [override: 2]
     * @param       m24:    {Number}        [override: 2]
     * @param       m31:    {Number}        [override: 2]
     * @param       m32:    {Number}        [override: 2]
     * @param       m33:    {Number}        [override: 2]
     * @param       m34:    {Number}        [override: 2]
     * @param       m41:    {Number}        [override: 2]
     * @param       m42:    {Number}        [override: 2]
     * @param       m43:    {Number}        [override: 2]
     * @param       m44:    {Number}        [override: 2]
     * @description Assigns new to the a given Float32Array.
     */

    public Set(matrix: Matrix4): Matrix4;
    public Set(array: Float32Array): Matrix4;
    public Set(array: number[]): Matrix4;
    public Set(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    public Set(...args: any[])
    {
        let [m11, m12, m13, m14,
             m21, m22, m23, m24,
             m31, m32, m33, m34,
             m41, m42, m43, m44] = Matrix4.GetArgs(args);

        this.M11 = m11; this.M12 = m12; this.M13 = m13; this.M14 = m14;
        this.M21 = m21; this.M22 = m22; this.M23 = m23; this.M24 = m24;
        this.M31 = m31; this.M32 = m32; this.M33 = m33; this.M34 = m34;
        this.M41 = m41; this.M42 = m42; this.M43 = m43; this.M44 = m44;

        return this;
    }
    
    /**
     * @function    Transpose:  {Float32Array}
     * @param       array:      {Float32Array}
     * @description Transposes a matrix.
     */
    public Transpose(): Matrix4
    {
        return this.Set(this.M11, this.M21, this.M31, this.M41,
                        this.M12, this.M22, this.M32, this.M42,
                        this.M13, this.M23, this.M33, this.M43,
                        this.M14, this.M24, this.M34, this.M44);
    }
    
    /**
     * @function    Identity:   {Float32Array}
     * @param       array:      {Float32Array}
     * @description If given a Float32Array, it resets it to an identity matrix.
     *              If not, it simply returns a new identity matrix.
     */
    public Identity(): Matrix4
    {
        return this.Set(1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1);
    }
    
    /**
     * @function    Determinant:    {Number}
     * @param       array:          {Float32Array}
     * @description Calculates the determinant of a given Float32Array.
     */
    public get Determinant(): number
    {
        return  this.M11 * this.M22 * this.M33 * this.M44 +
                this.M11 * this.M23 * this.M34 * this.M42 +
                this.M11 * this.M24 * this.M32 * this.M43 +
                this.M12 * this.M21 * this.M34 * this.M43 +
                this.M12 * this.M23 * this.M31 * this.M44 +
                this.M12 * this.M24 * this.M33 * this.M41 +
                this.M13 * this.M21 * this.M32 * this.M44 +
                this.M13 * this.M22 * this.M34 * this.M41 +
                this.M13 * this.M24 * this.M31 * this.M42 +
                this.M14 * this.M21 * this.M33 * this.M42 +
                this.M14 * this.M22 * this.M31 * this.M43 +
                this.M14 * this.M23 * this.M32 * this.M41 -
                this.M11 * this.M22 * this.M34 * this.M43 -
                this.M11 * this.M23 * this.M32 * this.M44 -
                this.M11 * this.M24 * this.M33 * this.M42 -
                this.M12 * this.M21 * this.M33 * this.M44 -
                this.M12 * this.M23 * this.M34 * this.M41 -
                this.M12 * this.M24 * this.M31 * this.M43 -
                this.M13 * this.M21 * this.M34 * this.M42 -
                this.M13 * this.M22 * this.M31 * this.M44 -
                this.M13 * this.M24 * this.M32 * this.M41 -
                this.M14 * this.M21 * this.M32 * this.M43 -
                this.M14 * this.M22 * this.M33 * this.M41 -
                this.M14 * this.M23 * this.M31 * this.M42;
    }
    
    /**
     * @function    Inverse:    {Float32Array}
     * @param       array:      {Float32Array}
     * @description Inverts a given Float32Array when possible i.e. the determinant
     *              is not 0.
     */
    public Inverse(): Matrix4
    {
        var det = this.Determinant;

        if (det !== 0)
            return this.Set((this.M22 * this.M33 * this.M44 +
                                this.M23 * this.M34 * this.M42 +
                                this.M24 * this.M32 * this.M43 -
                                this.M22 * this.M34 * this.M43 -
                                this.M23 * this.M32 * this.M44 -
                                this.M24 * this.M33 * this.M42) / det,
                            (this.M12 * this.M34 * this.M43 +
                                this.M13 * this.M32 * this.M44 +
                                this.M14 * this.M33 * this.M42 -
                                this.M12 * this.M33 * this.M44 -
                                this.M13 * this.M34 * this.M42 -
                                this.M14 * this.M32 * this.M43) / det,
                            (this.M12 * this.M23 * this.M44 +
                                this.M13 * this.M24 * this.M42 +
                                this.M14 * this.M22 * this.M43 -
                                this.M12 * this.M24 * this.M43 -
                                this.M13 * this.M22 * this.M44 -
                                this.M14 * this.M23 * this.M42) / det,
                            (this.M12 * this.M24 * this.M33 +
                                this.M13 * this.M22 * this.M34 +
                                this.M14 * this.M23 * this.M32 -
                                this.M12 * this.M23 * this.M34 -
                                this.M13 * this.M24 * this.M32 -
                                this.M14 * this.M22 * this.M33) / det,
                            
                            (this.M21 * this.M34 * this.M43 +
                                this.M23 * this.M31 * this.M44 +
                                this.M24 * this.M33 * this.M41 -
                                this.M21 * this.M33 * this.M44 -
                                this.M23 * this.M34 * this.M41 -
                                this.M24 * this.M31 * this.M43) / det,
                            (this.M11 * this.M33 * this.M44 +
                                this.M13 * this.M34 * this.M41 +
                                this.M14 * this.M31 * this.M43 -
                                this.M11 * this.M34 * this.M43 -
                                this.M13 * this.M31 * this.M44 -
                                this.M14 * this.M33 * this.M41) / det,
                            (this.M11 * this.M24 * this.M43 +
                                this.M13 * this.M21 * this.M44 +
                                this.M14 * this.M23 * this.M41 -
                                this.M11 * this.M23 * this.M44 -
                                this.M13 * this.M24 * this.M41 -
                                this.M14 * this.M21 * this.M43) / det,
                            (this.M11 * this.M23 * this.M34 +
                                this.M13 * this.M24 * this.M31 +
                                this.M14 * this.M21 * this.M33 -
                                this.M11 * this.M24 * this.M33 -
                                this.M13 * this.M21 * this.M34 -
                                this.M14 * this.M23 * this.M31) / det,
                            
                            (this.M21 *  this.M32 * this.M44 +
                                this.M22 * this.M34 * this.M41 +
                                this.M24 * this.M31 * this.M42 -
                                this.M21 * this.M34 * this.M42 -
                                this.M22 * this.M31 * this.M44 -
                                this.M24 * this.M32 * this.M41) / det,
                            (this.M11 * this.M34 * this.M42 +
                                this.M12 * this.M31 * this.M44 +
                                this.M14 * this.M32 * this.M41 -
                                this.M11 * this.M32 * this.M44 -
                                this.M12 * this.M34 * this.M41 -
                                this.M14 * this.M31 * this.M42) / det,
                            (this.M11 * this.M22 * this.M44 +
                                this.M12 * this.M24 * this.M41 +
                                this.M14 * this.M21 * this.M42 -
                                this.M11 * this.M24 * this.M42 -
                                this.M12 * this.M21 * this.M44 -
                                this.M14 * this.M22 * this.M41) / det,
                            (this.M11 * this.M24 *  this.M32 +
                                this.M12 * this.M21 * this.M34 +
                                this.M14 * this.M22 * this.M31 -
                                this.M11 * this.M22 * this.M34 -
                                this.M12 * this.M24 * this.M31 -
                                this.M14 * this.M21 * this.M32) / det,
                            
                            (this.M21 * this.M33 * this.M42 +
                                this.M22 * this.M31 * this.M43 +
                                this.M23 * this.M32 * this.M41 -
                                this.M21 * this.M32 * this.M43 -
                                this.M22 * this.M33 * this.M41 -
                                this.M23 * this.M31 * this.M42) / det,
                            (this.M11 *  this.M32 * this.M43 +
                                this.M12 * this.M33 * this.M41 +
                                this.M13 * this.M31 * this.M42 -
                                this.M11 * this.M33 * this.M42 -
                                this.M12 * this.M31 * this.M43 -
                                this.M13 * this.M32 * this.M41) / det,
                            (this.M11 * this.M23 * this.M42 +
                                this.M12 * this.M21 * this.M43 +
                                this.M13 * this.M22 * this.M41 -
                                this.M11 * this.M22 * this.M43 -
                                this.M12 * this.M23 * this.M41 -
                                this.M13 * this.M21 * this.M42) / det,
                            (this.M11 * this.M22 * this.M33 +
                                this.M12 * this.M23 * this.M31 +
                                this.M13 * this.M21 * this.M32 -
                                this.M11 * this.M23 * this.M32 -
                                this.M12 * this.M21 * this.M33 -
                                this.M13 * this.M22 * this.M31) / det);
        
        return this;
    }

    /**
     * @function    Sum:        {Float32Array}
     * @param       array1:     {Float32Array}
     * @param       array2:     {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(matrix: Matrix4): Matrix4;
    public Sum(array: Float32Array): Matrix4;
    public Sum(array: number[]): Matrix4;
    public Sum(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    public Sum(...args: any[]): Matrix4
    {
        let [m11, m12, m13, m14,
             m21, m22, m23, m24,
             m31, m32, m33, m34,
             m41, m42, m43, m44] = Matrix4.GetArgs(args);

        return this.Set(this.M11 + m11, this.M12 + m12, this.M13 + m13, this.M14 + m14,
                        this.M21 + m21, this.M22 + m22, this.M23 + m23, this.M24 + m24,
                        this.M31 + m31, this.M32 + m32, this.M33 + m33, this.M34 + m34,
                        this.M41 + m41, this.M42 + m42, this.M43 + m43, this.M44 + m44);
    }
    
    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override 1]
     * @param       array2:     {Float32Array}  [override 1]
     * @param       array:      {Float32Array}  [override 2]
     * @param       constant:   {Number}        [override 2]
     * @description Performs a matrix multiplication on two Float32Array or
     *              multiply a Float32Array with a scalar value.
     */
    public Mult(matrix: Matrix4): Matrix4;
    public Mult(array: Float32Array): Matrix4;
    public Mult(array: number[]): Matrix4;
    public Mult(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number): Matrix4;
    public Mult(...args: any[]): Matrix4
    {
        let [m11, m12, m13, m14,
             m21, m22, m23, m24,
             m31, m32, m33, m34,
             m41, m42, m43, m44] = Matrix4.GetArgs(args);

        return this.Set
        (
            this.M11 * m11 + this.M12 * m21 + this.M13 * m31 + this.M14 * m41,
            this.M11 * m12 + this.M12 * m22 + this.M13 * m32 + this.M14 * m42,
            this.M11 * m13 + this.M12 * m23 + this.M13 * m33 + this.M14 * m43,
            this.M11 * m14 + this.M12 * m24 + this.M13 * m34 + this.M14 * m44,
            
            this.M21 * m11 + this.M22 * m21 + this.M23 * m31 + this.M24 * m41,
            this.M21 * m12 + this.M22 * m22 + this.M23 * m32 + this.M24 * m42,
            this.M21 * m13 + this.M22 * m23 + this.M23 * m33 + this.M24 * m43,
            this.M21 * m14 + this.M22 * m24 + this.M23 * m34 + this.M24 * m44,
            
            this.M31 * m11 + this.M32 * m21 + this.M33 * m31 + this.M34 * m41,
            this.M31 * m12 + this.M32 * m22 + this.M33 * m32 + this.M34 * m42,
            this.M31 * m13 + this.M32 * m23 + this.M33 * m33 + this.M34 * m43,
            this.M31 * m14 + this.M32 * m24 + this.M33 * m34 + this.M34 * m44,
            
            this.M41 * m11 + this.M42 * m21 + this.M43 * m31 + this.M44 * m41,
            this.M41 * m12 + this.M42 * m22 + this.M43 * m32 + this.M44 * m42,
            this.M41 * m13 + this.M42 * m23 + this.M43 * m33 + this.M44 * m43,
            this.M41 * m14 + this.M42 * m24 + this.M43 * m34 + this.M44 * m44
        ); 
    }

    public Scale(scaler: number): Matrix4
    {
        return this.Set(this.M11 * scaler, this.M12 * scaler, this.M13 * scaler, this.M14 * scaler,
                        this.M21 * scaler, this.M22 * scaler, this.M23 * scaler, this.M24 * scaler,
                        this.M31 * scaler, this.M32 * scaler, this.M33 * scaler, this.M34 * scaler,
                        this.M41 * scaler, this.M42 * scaler, this.M43 * scaler, this.M44 * scaler);
    }
}

/**
 * @name        Vector2
 * @description This library contains the methods for 2 component vector operations.
 *              2 component vector are represented as a Float32Array of length 2.
 * @module      FWGE.Game.Maths 
 */
class Vector2
{
    public readonly Buffer: Float32Array;
    public get X(): number  { return this.Buffer[0]; }
    public set X(x: number) { this.Buffer[0] = x;    }
    public get Y(): number  { return this.Buffer[1]; }
    public set Y(y: number) { this.Buffer[1] = y;    }
 
    private static GetArgs(args: any): number[]
    {   
        if (!args)
            return [0, 0];

        if (args instanceof Vector2)
            return [args.X, args.Y];

        else if ((args instanceof Float32Array && args.length >= 2) || 
                (typeof args[0] === "number" && typeof args[1] === "number"))
            return args;
        
        return Vector2.GetArgs(args[0]);
    }

    public static get Zero(): Vector2   { return (new Vector2).Set(0, 0); }
    public static get One(): Vector2    { return (new Vector2).Set(1, 1); }
    public static get Unit(): Vector2   { return (new Vector2).Set(Math.sqrt(1/2), Math.sqrt(1/2)); }

    constructor()
    {
        this.Buffer = new Float32Array(3);
    }
    
    /**
     * @function    Set:        {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       x:          {Number}        [override: 2]
     * @param       y:          {Number}        [override: 2]
     * @description Assigns new values to the a given Float32Array.
     */
    public Set(vector: Vector2): Vector2;
    public Set(array: Float32Array): Vector2;
    public Set(array: number[]): Vector2;
    public Set(x: number, y: number): Vector2;
    public Set(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);

        this.X = x;
        this.Y = y;

        return this;
    }
    
    /**
     * @function    Length: {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the length of a given Float32Array.
     */
    public get Length(): number
    {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    }
    
    /**
     * @function    Sum:    {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(vector: Vector2): Vector2;
    public Sum(array: Float32Array): Vector2;
    public Sum(array: number[]): Vector2;
    public Sum(x: number, y: number): Vector2;
    public Sum(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.Set(this.X + x, this.Y + y);
    }
    
    /**
     * @function    Diff:   {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Subtracts two Float32Array component-wise.
     */
    public Diff(vector: Vector2): Vector2;
    public Diff(array: Float32Array): Vector2;
    public Diff(array: number[]): Vector2;
    public Diff(x: number, y: number): Vector2;
    public Diff(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.Set(x - this.X, y - this.Y);
    }
    
    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       constant:   {Number}        [override: 2]
     * @description Multiplies two Float32Array component-wise. If the second parameter is
     *              a number, the Float32Array is scale by it.
     */
    public Mult(vector: Vector2): Vector2;
    public Mult(array: Float32Array): Vector2;
    public Mult(array: number[]): Vector2;
    public Mult(x: number, y: number): Vector2;
    public Mult(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.Set(this.X * x, this.Y * y);
    }

    public Scale(scaler: number): Vector2
    {
        return this.Set(this.X * scaler, this.Y * scaler);
    }
    
    /**
     * @function    Dot:    {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the dot product of two Float32Array objects.
     */
    public Dot(vector: Vector2): number;
    public Dot(array: Float32Array): number;
    public Dot(array: number[]): number;
    public Dot(x: number, y: number): number;
    public Dot(...args: any[]): number
    {
        let [x, y] = Vector2.GetArgs(args);
        
        return this.X * x + this.Y * y;
    }
    
    /**
     * @function    Unit:   {Float32Array}
     * @param       array:  {Float32Array}
     * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
     */
    public Unit(): Vector2
    {
        var length = this.Length;

        if (length !== 0)
            this.Scale(1 / length);

        return this;
    }

    /**
     * @function    Cross:  {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Performs a cross multiplication on two Float32Array objects
     */
    public Cross(vector: Vector2): Vector2;
    public Cross(array: Float32Array): Vector2;
    public Cross(x: number, y: number): Vector2;
    public Cross(...args: any[]): Vector2
    {
        let [x, y] = Vector2.GetArgs(args);

        return this.Set(x, y);
    }
}



class Vector3 extends BufferedArray<number>
{
    // ---------- STATIC PROPERTIES ----------
    [index: number]: number;
    public readonly Buffer: Array<number>;

    public get X(): number  { return this.Buffer[0]; }
    public set X(x: number) { this.Buffer[0] = x;    }
    public get Y(): number  { return this.Buffer[1]; }
    public set Y(y: number) { this.Buffer[1] = y;    }
    public get Z(): number  { return this.Buffer[2]; }
    public set Z(z: number) { this.Buffer[2] = z;    }  
    
    public get Length(): number { return Vector3.Length(this); }
    // ---------- STATIC PROPERTIES ----------

    public constructor()
    public constructor(vector: Vector3 | Float32Array | number[])
    public constructor(x: number, y: number, z: number)
    public constructor(...args: any[])
    {
        super(3);
        this.Set(args);
    }
    
    // ---------- PUBLIC METHODS ----------
    public Set(vector: Vector3 | Float32Array | number[]): Vector3;
    public Set(x: number, y: number, z: number): Vector3;
    public Set(args: any): Vector3
    {
        return Vector3.Set(this, args);
    }
    
    public Sum(vector: Vector3 | Float32Array | number[]): Vector3;
    public Sum(x: number, y: number, z: number): Vector3;
    public Sum(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(this.X + x, this.Y + y, this.Z + z);
    }
    
    public Diff(vector: Vector3 | Float32Array | number[]): Vector3;
    public Diff(x: number, y: number, z: number): Vector3;
    public Diff(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(x - this.X, y - this.Y, z - this.Z);
    }
    
    public Mult(vector: Vector3 | Float32Array | number[]): Vector3;
    public Mult(x: number, y: number, z: number): Vector3;
    public Mult(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);
        
        return this.Set(this.X * x, this.Y * y, this.Z * z);
    }
    
    public Dot(vector: Vector3 | Float32Array | number[]): number;
    public Dot(x: number, y: number, z: number): number;
    public Dot(args: any): number
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.X * x + this.Y * y + this.Z * z;
    }

    public Cross(vector: Vector3 | Float32Array | number[]): Vector3;
    public Cross(x: number, y: number, z: number): Vector3;
    public Cross(args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return this.Set(this.Y * z + this.Z * y, this.Z * x - this.X * z, this.X * y + this.Y * x);
    }

    public Scale(scaler: number): Vector3
    {
        return this.Mult(scaler, scaler, scaler);
    }
    
    public Unit(): Vector3
    {
        var length = this.Length;

        if (length !== 0)
            this.Scale(1 / length);

        return this;
    }
    // ---------- PUBLIC METHODS ----------

    
    // ---------- STATIC PROPERTIES ----------
    public static get Zero():   Vector3 { return new Vector3(0, 0, 0); }
    public static get One():    Vector3 { return new Vector3(1, 1, 1); }
    // ---------- STATIC PROPERTIES ----------


    // ---------- STATIC METHODS ----------
    private static GetArgs(args: any = []): number[]
    {
        if (args.length === 1)
            args = args[0];
            
        if (args instanceof Vector3)
            return [args.X, args.Y, args.Z];

        else if (!!args && !!args.length && args.length === 3)
            return args;
        
        return [0, 0, 0];
    }

    public static Set(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Set(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Set(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);
    
        vector.X = x;
        vector.Y = y;
        vector.Z = z;

        return vector;
    }  

    public static Length(other: Vector3 | Float32Array | number[]): number;
    public static Length(x: number, y: number, z: number): number;
    public static Length(args: any): number
    {
        let [x, y, z] = Vector3.GetArgs(args);
        
        return Math.sqrt(x * x + y * y + z * z);
    }

    public static Sum(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Sum(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Sum(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(vector.X + x, vector.Y + y, vector.Z + z)
    }

    public static Diff(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Diff(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Diff(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(x - vector.X, y - vector.Y, z - vector.Z);
    }

    public static Mult(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Mult(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Mult(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(vector.X * x, vector.Y * y, vector.Z * z)
    }

    public static Scale(vector: Vector3, scaler: number): Vector3
    {
        return vector.Scale(scaler);
    }
    
    public static Cross(vector: Vector3, other: Vector3 | Float32Array | number[]): Vector3;
    public static Cross(vector: Vector3, x: number, y: number, z: number): Vector3;
    public static Cross(vector: Vector3, args: any): Vector3
    {
        let [x, y, z] = Vector3.GetArgs(args);

        return new Vector3(vector.Y * z + vector.Z * y, vector.Z * x - vector.X * z, vector.X * y + vector.Y * x);
    }

    public static Unit(vector: Vector3): Vector3
    {
        var length = vector.Length;

        if (length !== 0)
            vector.Scale(1 / length);

        return vector;
    }
    // ---------- STATIC METHODS ----------
}

/**
 * @name        Vector4
 * @description This library contains the methods for 2 component vector operations.
 *              4 component vector are represented as a Float32Array of length 4.
 * @module      FWGE.Game.Maths 
 */
class Vector4
{
    public readonly Buffer: Float32Array;
    public get W(): number  { return this.Buffer[0]; }
    public set W(w: number) { this.Buffer[0] = w;    }
    public get X(): number  { return this.Buffer[1]; }
    public set X(x: number) { this.Buffer[1] = x;    }
    public get Y(): number  { return this.Buffer[2]; }
    public set Y(y: number) { this.Buffer[2] = y;    }
    public get Z(): number  { return this.Buffer[3]; }
    public set Z(z: number) { this.Buffer[3] = z;    }

    private static GetArgs(args: any): number[]
    {   
        if (!args)
            return [0, 0, 0, 0];

        if (args instanceof Vector4)
            return [args.W, args.X, args.Y, args.Z];

        else if ((args instanceof Float32Array && args.length >= 4) || 
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
            return args;

        return Vector4.GetArgs(args[0]);
    }
    
    public static get Zero(): Vector4   { return (new Vector4).Set(0, 0, 0, 0); }
    public static get One(): Vector4   { return (new Vector4).Set(1, 1, 1, 1); }
    public static get Unit(): Vector4    { return (new Vector4).Set(0.5, 0.5, 0.5, 0.5); }

    constructor()
    {
        this.Buffer = new Float32Array(4);
    }

    /**
     * @function    Set:        {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       w:          {Number}        [override: 2]
     * @param       x:          {Number}        [override: 2]
     * @param       y:          {Number}        [override: 2]
     * @param       z:          {Number}        [override: 2]
     * @description Assigns new values to the a given Float32Array.
     */
    public Set(vector: Vector4): Vector4;
    public Set(array: Float32Array): Vector4;
    public Set(array: number[]): Vector4;
    public Set(w: number, x: number, y: number, z: number): Vector4;
    public Set(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        this.W = w;
        this.X = x;
        this.Y = y;
        this.Z = z;

        return this;
    }
    
    /**
     * @function    Length: {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the length of a given Float32Array.
     */
    public get Length(): number
    {
        return Math.sqrt(this.W * this.W + this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }
    
    /**
     * @function    Sum:    {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Adds two Float32Array component-wise.
     */
    public Sum(vector: Vector4): Vector4;
    public Sum(array: Float32Array): Vector4;
    public Sum(array: number[]): Vector4;
    public Sum(w: number, x: number, y: number, z: number): Vector4;
    public Sum(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.Set(this.W + w, this.X + x, this.Y + y, this.Z + z);
    }
    
    /**
     * @function    Diff:   {Float32Array}
     * @param       array1: {Float32Array}
     * @param       array2: {Float32Array}
     * @description Subtracts two Float32Array component-wise.
     */
    public Diff(vector: Vector4): Vector4;
    public Diff(array: Float32Array): Vector4;
    public Diff(array: number[]): Vector4;
    public Diff(w: number, x: number, y: number, z: number): Vector4;
    public Diff(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.Set(w - this.W, x - this.X, y - this.Y, z - this.Z);
    }

    /**
     * @function    Mult:       {Float32Array}
     * @param       array1:     {Float32Array}  [override: 1]
     * @param       array2:     {Float32Array}  [override: 1]
     * @param       array:      {Float32Array}  [override: 2]
     * @param       constant:   {Number}        [override: 2]
     * @description Multiplies two Float32Array component-wise. If the second parameter is
     *              a number, the Float32Array is scale by it.
     */
    public Mult(vector: Vector4): Vector4;
    public Mult(array: Float32Array): Vector4;
    public Mult(array: number): Vector4;
    public Mult(w: number, x: number, y: number, z: number): Vector4;
    public Mult(...args: any[]): Vector4
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.Set(this.W * w, this.X * x, this.Y * y, this.Z * z);
    }

    public Scale(scaler: number): Vector4
    {
        return this.Set(this.W * scaler, this.X * scaler, this.Y * scaler, this.Z * scaler);
    }
    
    /**
     * @function    Dot:    {Number}
     * @param       array:  {Float32Array}
     * @description Calculates the dot product of two Float32Array objects.
     */
    public Dot(vector: Vector4): number;
    public Dot(array: Float32Array): number;
    public Dot(array: number[]): number;
    public Dot(w: number, x: number, y: number, z: number): number;
    public Dot(...args: any[]): number
    {
        let [w, x, y, z] = Vector4.GetArgs(args);

        return this.W * w + this.X * x + this.Y * y + this.Z * z;
    }

    /**
     * @function    Unit:   {Float32Array}
     * @param       array:  {Float32Array}
     * @description Scales the given Float32Array down to a unit vector i.e. the length is 1
     */
    public Unit(): Vector4
    {   
        let length = this.Length;

        if (length !== 0)
            this.Scale(1 / length);
            
        return this;
    }
}



class Quaternion extends BufferedArray<number>
{
    [index: number]: number;

    public get W(): number  { return this[0]; }
    public set W(w: number) { this[0] = w;    }
    public get X(): number  { return this[1]; }
    public set X(x: number) { this[1] = x;    }
    public get Y(): number  { return this[2]; }
    public set Y(y: number) { this[2] = y;    }
    public get Z(): number  { return this[3]; }
    public set Z(z: number) { this[3] = z;    }

    constructor()
    {
        super(4);
    }
}









/**
 * @name Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */
class Maths
{
    
    public static Radian(degree: number) { return Math.PI / 180 * degree; }
    public static Cot(angle: number) { return 1 / Math.tan(angle)}
    public static Clamp(value: number, min: number, max: number)  { return Math.max(Math.min(value, max), min); }
    
    /**
     * @property    Matrix2: {Matrix2} [read]
     * @description Operations for 2x2 matrices.
     * @see         FWGE.Maths.Matrix2
     */
    public Matrix2(...args: any[]): Matrix2
    {
        return new Matrix2().Set(args);
    }
    
    /**
     * @property    Matrix3: {Matrix3} [read]
     * @description Operations for 3x3 matrices.
     * @see         FWGE.Maths.Matrix3
     */
    public Matrix3(...args: any[]): Matrix3
    {
        return new Matrix3().Set(args);
    }
    
    /**
     * @property    Matrix4: {Matrix4} [read]
     * @description Operations for 4x4 matrices.
     * @see         FWGE.Maths.Matrix4
     */
    public Matrix4(...args: any[]): Matrix4
    {
        return new Matrix4().Set(args);
    }
    
    /**
     * @property    Vector2: {Vector2} [read]
     * @description Operations for 2 component veectors.
     * @see         FWGE.Maths.Vector2
     */
    public Vector2(...args: any[]): Vector2
    {
        return new Vector2().Set(args);
    }
    
    /**
     * @property    Vector3: {Vector3} [read]
     * @description Operations for 3 component veectors.
     * @see         FWGE.Maths.Vector3
     */
    public Vector3(...args: any[]): Vector3
    {
        return new Vector3(args);
    }
    
    /**
     * @property    Vector4: {Vector4} [read]
     * @description Operations for 4 component veectors.
     * @see         FWGE.Maths.Vector4
     */
    public Vector4(...args: any[]): Vector4
    {
        return new Vector4().Set(args);
    }
    
    /**
     * @property    Quaternion: {Quaternion} [read]
     * @description Operations for 4 component quaternions.
     * @see         FWGE.Maths.Quaternion
     */
    public Quaternion(): Quaternion
    {
        return new Quaternion();
    }  
}





interface IParticle extends IKeyFrame<Transform>
{
}

/**
 * @name        Particle
 * @description Definition of a single particle.
 * @module      FWGE.Game.ParticleSystem
 */
class Particle extends KeyFrame<Transform>
{
    public Elapsed: number;

    constructor(request: IParticle)
    {
        super(request);

        this.Elapsed = 0;
    }
}





interface IParticleSystem
{
    Name:           string;
    GameObject:     GameObject | null;
    Particle?:      IParticle;
}

/**
 * @name        ParticleSystem
 * @description Definition of a particle system.
 * @module      FWGE.Game
 */
class ParticleSystem extends GameItem
{
    public Particle: Particle;

    constructor(request: IParticleSystem =
    {
        Name:       "Particel System",
        GameObject: null
    })
    {
        super(request.Name, request.GameObject);
        this.Particle = new Particle(request.Particle);
    }

    public Update(): void { }
}












class IGameObject
{
    Name?:           string = "GameObject";
    Transform?:      Transform = new Transform({Position: [0,0,0], Rotation: [0,0,0], Scale:[1,1,1], Shear: [0,0,0]});
    Material?:       RenderMaterial | null = null;
    Mesh?:           Mesh | null = null;
    Light?:          LightItem | null = null;
    Physics?:        PhysicsItem | null = null;
    Animation?:      Animation | null = null;
    ParticleSystem?: ParticleSystem | null = null;
    Children?:       Array<GameObject> | null = null;
    Begin?:          Function = new Function();
    Update?:         Function = new Function();
    End?:            Function = new Function();
}

/**
 * @name GameObject
 * @description The main object container for object types.   
 * @module      FWGE.Game
 */
class GameObject extends Item
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
    
    constructor(request: IGameObject = new IGameObject())
    {
        super(request.Name);

        let self = this;
        this.Transform      = new Transform(request.Transform);
        this.Animation      = request.Animation;
        this.Material       = request.Material;
        this.Mesh           = request.Mesh;
        this.Physics        = request.Physics;
        this.ParticleSystem = request.ParticleSystem;
        this.Light          = request.Light;

        this.Begin  = request.Begin || new Function();
        this.Update = request.Update || new Function();
        this.End    = request.End || new Function();

        GameObject.Objects.push(this);
        if (request.Children)
            request.Children.forEach(function(child){ self.Add(child); });
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













/**
 * @name        GameEngine
 * @description Something...
 * @module      FWGE
 */
class GameEngine
{
    private Running:        boolean = false;
    private AnimationFrame: number = -1;
    
    /**
     * @property    Input: {Input}
     * @description The module that handles user inputs.
     * @see         FWGE.Game.Input
     */
    public Input:  Input;

    /**
     * @property    Light: {Light}
     * @description The Light module.
     * @see         FWGE.Game.Light
     */
    public Light:  Light;

    /**
     * @property    Maths: {Maths}
     * @description The Maths module.
     * @see         FWGE.Game.Maths
     */
    public Maths:  Maths;

    /**
     * @property    Time: {Time}
     * @description The running clock.
     * @see         FWGE.Game.Time
     */
    public Time:   Time;

    /**
     * @property    Camera: {Camera}
     * @description The viewer.
     * @see         FWGE.Game.Camera
     */
    public Camera: Camera;
    
    constructor()
    {
        this.Camera = new Camera();
        this.Light  = new Light();
        this.Maths  = new Maths();
        this.Time   = new Time();
    }        
    
    /**
     * @function    Animation: {Function}
     * @description The Animation constructor.
     * @see         FWGE.Game.Animation
     */
    Animation(request: IAnimation): Animation
    {
        return new Animation(request);
    }
    
    /**
     * @function    GameObject: {Function}
     * @description The GameObject constructor.
     * @see         FWGE.Game.GameObject
     * @param       request:        {Object}
     *              > Material:     {Material}      [null]
     *              > Mesh:         {Mesh}          [null]
     *              > Transform:    {Transform}     [null]
     *              > Physics:      {Physics}       [null]
     *              > Animation:    {Animation}     [null]
     *              > LightItem:    {LightObject}   [null]
     *              > Begin:        {Function}      [null]
     *              > Update:       {Function}      [null]
     *              > End:          {Function}      [null]
     */
    GameObject(request: IGameObject): GameObject
    {
        return new GameObject(request);
    }
    
    /**
     * @function    ParticleSystem: {Function}
     * @description The ParticleSystem constructor.
     * @see         FWGE.Game.ParticleSystem
     */
    ParticleSystem(request: IParticleSystem): ParticleSystem
    {
        return new ParticleSystem(request);
    }
    
    /**
     * @function    Transform: {Transform}
     * @description The Transform constructor.
     * @see         FWGE.Game.Transform
     */
    Transform(request: ITransform): Transform
    {
        return new Transform(request);
    }

    /**
     * @function    Init: {undefined}
     * @description Initializes the game engine
     */
    Init(canvas: HTMLCanvasElement): void
    {
        this.Input  = new Input(canvas);
    }

    /**
     * @function    Run: {undefined}
     * @description Runs the main game loop
     */
    private Run(Game: GameEngine, Physics: PhysicsEngine, Render: RenderEngine): void
    {
        let self = this;

        this.AnimationFrame = window.requestAnimationFrame(function(){self.Run(Game, Physics, Render);});

        Game.Update(Game, Physics);
        if (this.Running)
        {
            Physics.Update();
            Render.Update(Game);
        }
    }
    

    /**
     * @function    GameUpdate: {undefined}
     * @description Updates the scene
     */
    Update(Game: GameEngine, Physics: PhysicsEngine): void
    {
        this.Time.Update();
        this.Camera.Update();

        var i = GameObject.Objects.length;
        while (--i >= 0)
            GameObject.Objects[i].ObjectUpdate(Game, Physics);

        this.Input.InputUpdate();
    }

    /**
     * @function    Start: {undefined}
     * @description Initiates/resumes the main game loop
     */
    Start(Game: GameEngine, Physics: PhysicsEngine, Render: RenderEngine): void
    {
        if(!this.Running)
            this.Running = true;

        if (this.AnimationFrame === -1)
            this.Run(Game, Physics, Render);
    }

    Pause(): void
    {
        if (!this.Running)
            this.Running = false;
    }

    /**
     * @function    Stop: {undefined}
     * @description Suspends the main game loop
     */
    Stop(): void
    {
        if (this.Running)
            this.Running = false;

        if (this.AnimationFrame !== -1)
        {
            window.cancelAnimationFrame(this.AnimationFrame);
            this.AnimationFrame = -1;
        }

        this.Time.Reset();
    }
}

interface IPhysicsBody
{
    Name?:  string;
    Mass?:  number;
    LockX?: boolean;
    LockY?: boolean;
    LockZ?: boolean;
}

/**
 * @name PhysicsBody
 * @description This object provides the masic physical properties of an object.
 * @module      FWGE.Physics
 */
class PhysicsBody extends Item
{
    /**
     * @property    Mass: {Number} [read|write]
     * @description The mass of the gameobject this physics body is attached to.
     */
    public Mass     : number; 
    /**
     * @property    LockX: {Boolean} [read|write]
     * @description Determines whether gravity will affect it along the x-axis
     */
    public LockX    : boolean;
        /**
         * @property    LockY: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the y-axis
         */
    public LockY    : boolean;
        /**
         * @property    LockZ: {Boolean} [read|write]
         * @description Determines whether gravity will affect it along the z-axis
         */
    public LockZ    : boolean;
        /**
         * @property    Grounded: {Boolean} [read]
         * @description Determines whether the object is on top of another
         */
    public Grounded : boolean = false;
    /**
     * @property    Velocity: {Number} [read|write]
     * @description The mass of the gameobject this physics body is attached to.
     */
    public Velocity : number = 0.0;
    
    constructor(request: IPhysicsBody)
    {
        super(request.Name || "Phsyics Body");

        this.Mass = request.Mass || 1.0;
        this.LockX = request.LockX || true;
        this.LockY = request.LockY || true;
        this.LockZ = request.LockZ || true;
    }
}




interface IPhysicsMaterial
{
    Name?:          string;
    GameObject?:    GameObject | null;
}

/**
 * @name        PhysicsMaterial
 * @description Some words of encouragement
 */
class PhysicsMaterial extends GameItem
{
    constructor(request: IPhysicsMaterial)
    {
        super(request.Name || "Physics Material", request.GameObject || null);
    }
}










interface IPhysicsItem
{
    Name?:          string;
    GameObject?:    GameObject | null;
    Collider?:      BoxCollider | SphereCollider | null;
    Material?:      PhysicsMaterial | null;
    Body?:          PhysicsBody;
}

/**
 * @name PhysicsItem
 * @description The physics item
 * @module      FWGE.Physics
 * @param       request: {Object}
 */
class PhysicsItem extends GameItem
{
    /**
     * @property    Collision: {Collision} [read|write]
     * @description Add some words...
     */
    public Collider: BoxCollider | SphereCollider | null;
    /**
     * @property    PhysicsMaterial: {PhysicsMaterial} [read|write]
     * @description Add some words...
     */
    public Material: PhysicsMaterial | null;
    /**
     * @property    PhysicsBody: {PhysicsBody} [read]
     * @description Add some words...
     */
    public Body: PhysicsBody;

    constructor(request: IPhysicsItem)
    {
        super(request.Name || "Physics Item", request.GameObject || null);
        
        this.Collider = request.Collider || null;
        this.Material = request.Material || null;
        this.Body = request.Body || new PhysicsBody({});
    }


    /**
     * @property    PhysicsUpdate: {Function}
     * @description Update the physics stuffs...
     */
    Update(Game: GameEngine, Physics: PhysicsEngine): void
    {
        if (!this.Body.LockY)
        {
            this.Body.Velocity += (Physics.Gravity * (Game.Time.Delta / 1000));

            if (this.GameObject)
                this.GameObject.Transform.Position.Y += this.Body.Velocity;
        }
    }
}





interface ICollider
{
	Name?:          string
	PhysicsItem?:   PhysicsItem | null;
	Position?:      Vector3;
}

/**
 * @name        Collider
 * @description This is the base object for collision objects
 * @module      FWGE.Physics
 */
class Collider extends Item
{
    
    public Position: Vector3;
    /**
     * @property    PhysicsItem: {PhysicsItem} [read|write]
     * @description The physics item this collider is attached to
     */
    public readonly PhysicsItem: PhysicsItem | null;
    
    constructor(request: ICollider)
    {
        super(request.Name || "Collider");

        this.Position = request.Position || Vector3.Zero;
        this.PhysicsItem = request.PhysicsItem || null;
    }   
}



interface IBoxCollider extends ICollider
{
	Height?: 	number;
	Width?: 	number;
	Breadth?: 	number;
}

/**
 * @name        BoxCollider
 * @description This is a cube-shaped collision object
 * @module      FWGE.Physics
 */
class BoxCollider extends Collider
{
    public Height:  number;
    public Width:   number;
    public Breadth: number;

    constructor(request: IBoxCollider)
    {
        super(request);

        this.Height = request.Height || 2;
        this.Width = request.Width || 2;
        this.Breadth = request.Breadth || 2;
    }
}



interface ISphereCollider extends ICollider
{
	Radius?: number;
}

/**
 * @name        SphereCollider
 * @description This is a sphere-shaped collision object
 * @module      FWGE.Physics
 */
class SphereCollider extends Collider
{
    public Radius: number;

    constructor(request: ISphereCollider)
    {
        super(request);

        this.Radius = request.Radius || 2;
    }
}




/**
 * @name 		Colliders
 * @description This module creates collision objects.
 * @module      FWGE.Physics
 */
class Colliders
{
	constructor() {}

	/**
	 * @function	BoxCollider: {BoxCollider}
	 * @description	A cube-shaped collider	
	 */
	public Box(request: IBoxCollider): BoxCollider
	{
		return new BoxCollider(request);
	}

	/**
	 * @function	SphereCollider: {SphereCollider}
	 * @description	A cube-shaped collider	
	 */
	public Sphere(request: ISphereCollider): SphereCollider
	{
		return new SphereCollider(request);
	}
}





/**
 * @name PhysicsEngine
 * @description Something...
 * @module      FWGE
 */
class PhysicsEngine
{
    /**
     * @property    Collision: {Function}
     * @description Constructor for a Colliders object.
     * @see         FWGE.Physics.Colliders
     */
    public readonly Colliders: Colliders = new Colliders();
    
    /**
     * @constant    Gravity: {Number}
     * @description Gravity in m/s
     */
    public readonly Gravity: number = -9.8;

    /**
     * @function    Init: void
     * @description Initializes the physics engine
     */
    Init()
    {

    }

    /**
     * @function    PhysicsUpdate: void
     * @description Initializes the physics engine
     */
    Update()
    {

    }

    /**
     * @property    PhysicsBody: {Function}
     * @description Constructor for a Physics Body.
     * @see         FWGE.Physics.PhysicsBody
     */
    Body(request: IPhysicsBody): PhysicsBody
    {
        return new PhysicsBody(request);
    }
    
    /**
     * @property    PhysicsMaterial: {Function}
     * @description Constructor for a PhysicsMaterial.
     * @see         FWGE.Physics.PhysicsMaterial
     */
    Material(request: IPhysicsMaterial): PhysicsMaterial
    {
        return new PhysicsMaterial(request);
    }
}




/**
 * @name Colour
 * @description This module is used to create simple 3 valued arrays
 *              representing the rgb values of colours.
 * @module      FWGE.Render
 */
class Colour extends BufferedArray<number>
{
    [index: number]: number;
    public readonly Buffer: Array<number>;

    get R(): number  { return this.Buffer[0]; }
    set R(r: number) { this.Buffer[0] = Maths.Clamp(r, 0, 1); }
    get G(): number  { return this.Buffer[1]; }
    set G(g: number) { this.Buffer[1] = Maths.Clamp(g, 0, 1); }
    get B(): number  { return this.Buffer[2]; }
    set B(b: number) { this.Buffer[2] = Maths.Clamp(b, 0, 1); }
    get A(): number  { return this.Buffer[3]; }
    set A(a: number) { this.Buffer[3] = Maths.Clamp(a, 0, 1); }

    get BIN():      string { return `(${this.R.toString(2) }, ${this.G.toString(2) }, ${this.B.toString(2) }, ${this.A.toString(2) })`; }
    get OCT():      string { return `(${this.R.toString(8) }, ${this.G.toString(8) }, ${this.B.toString(8) }, ${this.A.toString(8) })`; }
    get HEX():      string { return `(${this.R.toString(16)}, ${this.G.toString(16)}, ${this.B.toString(16)}, ${this.A.toString(16)})`; }
    get DEC():      string { return `(${this.R},              ${this.G},              ${this.B},              ${this.A})`; }
    get FLOAT():    string { return `(${this.R * 255},        ${this.G * 255},        ${this.B * 255},        ${this.A * 255})`; }

    public toString(): string { return this.FLOAT; }

    public static GetArgs(args: any): number[]
    {
        if (args.length === 1)
            args = args[0];
        
        if (args instanceof Colour)
            return [args.R, args.G, args.B, args.A];

        else if (!!args.length && args.length === 4)
            return args;

        return [0, 0, 0, 0];
    }

    /**
     * @function    Create: {Float32Array}
     * @description Creates a new Float32Array array. These arrays have R,G, and B accessors.
     * @param       {Float32Array}  [nullable, override 1]
     * @param       {Number}        [nullable, override 2]
     * @param       {Number}        [nullable, override 2]
     * @param       {Number}        [nullable, override 2]
     */
    public constructor()
    public constructor(colour: Colour | Float32Array | number[])
    public constructor(r: number, g: number, b: number, a: number)
    public constructor(...args: any[])
    {
        super(4);
        this.Set(args);
    }

    public Set(colour: Colour | Float32Array | number[]): Colour;
    public Set(r: number, g: number, b: number, a: number): Colour;
    public Set(args: any): Colour
    {
        let [r, b, g, a] = Colour.GetArgs(args);

        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;

        return this;
    }
}




class IMesh
{
    Name:      string = '';
    Position:  Array<number> = new Array<number>();
    Indices:   Array<number> = new Array<number>();
    Wireframe: Array<number> = new Array<number>();
    UVs:       Array<number> = new Array<number>();
    Colours:   Array<number> = new Array<number>();
    Normals:   Array<number> = new Array<number>();
}

/**
 * @name        Mesh
 * @description The vertex array buffer containers
 * @module      FWGE.Render
 */
class Mesh extends Item
{
    /**
     * @constant    PositionBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the vertex position vectors
     */
    public readonly PositionBuffer: WebGLBuffer | null;

    /**
     * @constant    UVBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the uv coordinate vectors
     */
    public readonly UVBuffer: WebGLBuffer | null;

    /**
     * @constant    ColourBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the colour for the vertices
     */
    public readonly ColourBuffer: WebGLBuffer | null;

    /**
     * @constant    NormalBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the nromal vectors
     */
    public readonly NormalBuffer: WebGLBuffer | null;
    
    /**
     * @constant    IndexBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the indices
     */
    public readonly IndexBuffer: WebGLBuffer | null;
    
    /**
     * @constant    IndexBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the indices
     */
    public readonly WireframeBuffer: WebGLBuffer | null;
    
    /**
     * @constant    VertexCount: {Number} [read]
     * @description The number of vertices in the mesh
     */
    public readonly VertexCount: number;
    
    /**
     * @constant    VertexCount: {Number} [read]
     * @description The number of vertices in the mesh
     */
    public readonly WireframeCount: number;
    
    constructor(request: IMesh)
    {
        super(request.Name || "Mesh");

        this.VertexCount = request.Indices.length;
        this.WireframeCount = request.Wireframe ? request.Wireframe.length : 0;

        this.PositionBuffer = FWGE.GL.createBuffer();
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.PositionBuffer);
        FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Position), FWGE.GL.STATIC_DRAW);
        
        this.IndexBuffer = FWGE.GL.createBuffer();
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.Indices), FWGE.GL.STATIC_DRAW);
        
        if (!request.Colours || request.Colours.length !== request.Position.length)
            request.Colours = request.Position.map(function(){ return 1.0; });

        this.ColourBuffer = FWGE.GL.createBuffer();
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.ColourBuffer);
        FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Colours), FWGE.GL.STATIC_DRAW);

        if (request.Wireframe)
        {
            this.WireframeBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer);
            FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.Wireframe), FWGE.GL.STATIC_DRAW);
        }
        else
            this.WireframeBuffer = null;

        if (request.UVs)
        {
            this.UVBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.UVBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.UVs), FWGE.GL.STATIC_DRAW);
        }
        else
            this.UVBuffer = null;

        if (request.Normals)
        {
            this.NormalBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.NormalBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER,new Float32Array(request.Normals), FWGE.GL.STATIC_DRAW);
        }
        else
            this.NormalBuffer = null;
    }
}






class IRenderMaterial
{
    Name:           string = '';
    Ambient:        Colour = new Colour();
    Diffuse:        Colour = new Colour();
    Specular:       Colour = new Colour();
    Alpha:          number = 1.0;
    Shininess:      number = 32;
    Shader:         Shader | null = null;
}

interface ISetTexture
{
    ImageMap:       string;
    BumpMap:        string;
    SpecularMap:    string;
}

// Hillary: 081 393 0871
// Bruce:   073 120 4773

/**
 * @name        Material
 * @description This object defines how the mesh in a gameobject will look
 *              like when rendered to a screen.
 * @module      FWGE.Render
 */
class RenderMaterial extends Item
{
    public Ambient:     Colour;
    public Diffuse:     Colour;
    public Specular:    Colour;
    public Alpha:       number;
    public Shininess:   number;
    public Shader:      Shader | null;
    public ImageMap:    WebGLTexture | null;
    public BumpMap:     WebGLTexture | null;
    public SpecularMap: WebGLTexture | null;

    constructor(request: IRenderMaterial)
    {
        super(request.Name || "Render Material");

        this.Ambient = new Colour(request.Ambient) || new Colour(0.50, 0.50, 0.50, 1.00);
        this.Diffuse = new Colour(request.Diffuse) || new Colour(0.75, 0.75, 0.75, 1.00);
        this.Specular = new Colour(request.Specular) || new Colour(1.00, 1.00, 1.00, 1.00)
        this.Alpha = request.Alpha || 1;
        this.Shininess = request.Shininess || 5;
        this.Shader = request.Shader || null;

        this.ImageMap = null;
        this.BumpMap = null;
        this.SpecularMap = null;
    }   
     
    /**
     * @function    SetTextures: void
     * @description This function simply loads the appropriate textures into memory.   
     * @param       request:        {Object}
     *              > imagemap:     {String}    [null]
     *              > bumpmap:      {String}    [null]
     *              > specularmap:  {String}    [null]
     */
    SetTextures(request: ISetTexture)
    {
        if (!!request.ImageMap)
        {
            if (!!this.ImageMap)
                FWGE.GL.deleteTexture(this.ImageMap);

            apply_image(request.ImageMap, this, 'image');
        }
        if (!!request.BumpMap)
        {
            if (!!this.BumpMap)
                FWGE.GL.deleteTexture(this.BumpMap);

            apply_image(request.BumpMap, this, 'bump');
        }
        if (!!request.SpecularMap)
        {
            if (!!this.SpecularMap)
                FWGE.GL.deleteTexture(this.SpecularMap);

            apply_image(request.SpecularMap, this, 'specular');
        }

        function apply_image(src: string, material: RenderMaterial, type: string)
        {
            var img = new Image();
            var texture: WebGLTexture | null;
            function isPowerOf2(value: number) { return (value & (value - 1)) == 0; };

            switch(type)
            {
                case 'image':
                    material.ImageMap = FWGE.GL.createTexture();
                    texture = material.ImageMap;
                break;

                case 'bump':
                    material.BumpMap = FWGE.GL.createTexture();
                    texture = material.BumpMap;
                break;

                case 'specular':
                    material.SpecularMap = FWGE.GL.createTexture();
                    texture = material.SpecularMap;
                break;

                default: texture = null;
            }

            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
            FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, 1, 1, 0, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

            img.onload = function()
            {
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
                FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, img);

                // then either generate mips if the image uses power-of-2 dimensions or 
                // set the filtering correctly for non-power-of-2 images.
                if (isPowerOf2(img.width) && isPowerOf2(img.height))
                {
                    FWGE.GL.generateMipmap(FWGE.GL.TEXTURE_2D);
                    FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MAG_FILTER, FWGE.GL.LINEAR);
                    FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR_MIPMAP_NEAREST);
                }
                else
                {
                    FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_S, FWGE.GL.CLAMP_TO_EDGE);
                    FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_T, FWGE.GL.CLAMP_TO_EDGE);
                    FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR);
                }

                //FWGE.GL.pixelStorei(FWGE.GL.UNPACK_FLIP_Y_WEBGL, true);                
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            };
            img.src = src;
        }
    }
}






/**
 * @name        ModelView
 * @description This module handles the model view matrices of the
 *              objects within the scene by applying the appropriate
 *              transformations.
 */
class ModelView
{
    private Stack: Array<Matrix4>;

    constructor()
    {
        this.Stack = new Array<Matrix4>();
    }
    
    /**
     * @function    PushMatrix: void
     * @description Pushes a copy of the last matrix onto the stack. If the stack is
     *              currently empty, an identity matrix is pushed.
     */
    public Push(): Matrix4
    {
        let matrix = this.Peek();
        this.Stack.push(matrix/*.Identity()*/);
        return matrix;
    }

    /**
     * @function    PeekMatrix: {Float32Array}
     * @description Returns the matrix on the top of the stack. If the stack
     *              is empty, an identity matrix is returned.
     */
    public Peek(): Matrix4
    {
        if (this.Stack.length === 0)
            return (new Matrix4()).Set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        else
            return this.Stack[this.Stack.length - 1];
    }

    /**
     * @function    PopMatrix: {Float32Array}
     * @description Returns and removes the matrix on the top os the stack.
     */
    public Pop(): Matrix4 | undefined
    {
        if (this.Stack.length === 0)
            return new Matrix4().Identity();
        else
            return this.Stack.pop();
    }

    /**
     * @function    Transform: void
     * @description Performs the appropriate matrix operations for the different
     *              transformations on the the top matrix.
     * @param       transform: {Transform}
     */
    public Transform(transform: Transform): void
    {
        this.Peek().Set
        (
            this.Shear
            (
                this.Scale
                (
                    this.Rotate
                    (
                        this.Translate
                        (
                            this.Peek(),
                            transform.Position
                        ),
                        transform.Rotation
                    ),
                    transform.Scale
                ),
                transform.Shear
            )
        );
    }

    /**
     * @function    Translate: {Float32Array}
     * @description Returns a translation matrix.
     * @param       matrix:         {Float32Array}
     * @param       translation:    {Float32Array}
     */
    private Translate(matrix: Matrix4, translation: Vector3): Matrix4
    {
        return matrix.Set
        (
            matrix.M11, matrix.M12, matrix.M13, matrix.M14,
            matrix.M21, matrix.M22, matrix.M23, matrix.M24,
            matrix.M31, matrix.M32, matrix.M33, matrix.M34,

            matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41,
            matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42,
            matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43,
            matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44
        );
    }

    /**
     * @function    Translate: {Float32Array}
     * @description Returns a rotation matrix.
     * @param       matrix:     {Float32Array}
     * @param       rotation:   {Float32Array}
     */
    private Rotate(matrix: Matrix4, rotation: Vector3): Matrix4
    {    
        var rot: Matrix4 = new Matrix4().Identity();
        let x = Maths.Radian(rotation.X);
        let y = Maths.Radian(rotation.Y);
        let z = Maths.Radian(rotation.Z);

        matrix.Set
        (
            rot.Mult(
                Math.cos(z), -Math.sin(z), 0.0, 0.0,
                Math.sin(z),  Math.cos(z), 0.0, 0.0,
                                0.0,                    0.0, 1.0, 0.0,
                                0.0,                    0.0, 0.0, 1.0
            ).Mult(
                Math.cos(y), 0.0, Math.sin(y), 0.0,
                                0.0, 1.0,                   0.0, 0.0,
            -Math.sin(y), 0.0, Math.cos(y), 0.0,
                                0.0, 0.0,                   0.0, 1.0

            ).Mult(
            
                1.0,                   0.0,                    0.0, 0.0,
                0.0, Math.cos(x), -Math.sin(x), 0.0,
                0.0, Math.sin(x),  Math.cos(x), 0.0,
                0.0,                   0.0,                    0.0, 1.0
            ).Mult(matrix)
        );

        return matrix;
    }

    /**
     * @function    Translate: {Float32Array}
     * @description Returns a scaler matrix.
     * @param       matrix:     {Float32Array}
     * @param       scalers:    {Float32Array}
     */
    private Scale(matrix: Matrix4, scalers: Vector3): Matrix4
    {                    
        return matrix.Set
        (
            matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X,
            matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y,
            matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z,
                        matrix.M41,             matrix.M42,             matrix.M43,             matrix.M44
        );
    }

    /**
     * @function    Shear: {Float32Array}
     * @description Returns a shearing matrix.
     * @param       matrix:    {Float32Array}
     * @param       angles:    {Float32Array}
     */
    private Shear(matrix: Matrix4, angles: Vector3): Matrix4
    {
        var phi   = Maths.Radian(angles.X);
        var theta = Maths.Radian(angles.Y);
        var rho   = Maths.Radian(angles.Z);

        return new Matrix4().Set
        (
                      1.0,             0.0, Math.tan(rho), 0.0,
            Math.tan(phi),             1.0,           0.0, 0.0,
                      0.0, Math.tan(theta),           1.0, 0.0,
                      0.0,             0.0,           0.0, 1.0
        ).Mult(matrix);
    }
}




interface ICameraUpdate
{
    FOV?:       number;
    Aspect?:    number;
    Left?:      number;
    Right?:     number;
    Top?:       number;
    Bottom?:    number;
    Near?:      number;
    Far?:       number;
    Theta?:     number;
    Phi?:       number;
}

/**
 * @name Projection
 * @description This module handles the matrices regarding the camera's current
 *              view mode, and its orientation within the scene.
 * @module      FWGE.Render
 */
class Projection
{
    public readonly ViewerMatrix: Matrix4;

    constructor()
    {
        this.ViewerMatrix = Matrix4.Identity;
    }
    
    private Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): void
    {
        theta   = Maths.Cot(Maths.Radian(theta));
        phi     = Maths.Cot(Maths.Radian(phi));

        left    -= near * theta;
        right   -= near * theta;
        top     -= near * phi;
        bottom  -= near * phi;

        this.ViewerMatrix.Set
        (

                          2 / (right - left),                                0,                            0, 0,
                                           0,               2 / (top - bottom),                            0, 0,
                                       theta,                              phi,            -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        );
        
    }
    
    private Perspective(field_of_view: number, aspect_ratio: number, near: number, far: number): void
    {
        var top     = near * Math.tan(Maths.Radian(field_of_view));
        var right   = top * aspect_ratio;
        
        var left    = -right;
        var bottom  = -top;
        var width   = right - left;
        var height  = top - bottom;
        var depth   = far - near;

        this.ViewerMatrix.Set
        (

                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        );
    }
    
    public Update(mode: CameraMode, request: ICameraUpdate): void
    {                            
        switch (mode)
        {
            case CameraMode.PERSPECTIVE:
                this.Perspective
                (
                    request.FOV     ||  45,
                    request.Aspect  ||  16 / 9,
                    request.Near    ||  0.1,
                    request.Far     ||  1000.1
                );
            break;

            case CameraMode.ORTHOGRAPHIC:
                this.Orthographic
                (
                    request.Left    || -10,
                    request.Right   ||  10,
                    request.Top     ||  10,
                    request.Bottom  || -10,
                    request.Near    ||  0,
                    request.Far     ||  20,
                    request.Theta   ||  90,
                    request.Phi     ||  90
                );
            break;
        }
    }
}




interface IShader
{
    Name:           string;
    Height?:        number;
    Width?:         number;
    VertexShader:   string;
    FragmentShader: string;
}

class ShaderAttributes
{
    public readonly Position:   number = -1;
    public readonly Colour:     number = -1;
    public readonly UV:         number = -1;
    public readonly Normal:     number = -1;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Position   = GL.getAttribLocation(Program, "A_Position");
        this.Colour     = GL.getAttribLocation(Program, "A_Colour");
        this.UV         = GL.getAttribLocation(Program, "A_UV");
        this.Normal     = GL.getAttribLocation(Program, "A_Normal");
    }
}

class MaterialUniforms
{
    public readonly Ambient:        WebGLUniformLocation;
    public readonly Diffuse:        WebGLUniformLocation;
    public readonly Specular:       WebGLUniformLocation;
    public readonly Shininess:      WebGLUniformLocation;
    public readonly Alpha:          WebGLUniformLocation;
    
    public readonly HasImage:       WebGLUniformLocation;
    public readonly HasBump:        WebGLUniformLocation;
    public readonly HasSpecular:    WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Ambient        = GL.getUniformLocation(Program, "U_Material.Ambient");
        this.Diffuse        = GL.getUniformLocation(Program, "U_Material.Diffuse");
        this.Specular       = GL.getUniformLocation(Program, "U_Material.Specular");
        this.Shininess      = GL.getUniformLocation(Program, "U_Material.Shininess");
        this.Alpha          = GL.getUniformLocation(Program, "U_Material.Alpha");

        this.HasImage       = GL.getUniformLocation(Program, "U_Material.HasImage");
        this.HasBump        = GL.getUniformLocation(Program, "U_Material.HasBump");
        this.HasSpecular    = GL.getUniformLocation(Program, "U_Material.HasSpecular");
    }
}

class MatrixUniforms
{
    public readonly ModelView:  WebGLUniformLocation;
    public readonly Projection: WebGLUniformLocation;
    public readonly Normal:     WebGLUniformLocation;
 
    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.ModelView  = GL.getUniformLocation(Program, "U_Matrix.ModelView");
        this.Projection = GL.getUniformLocation(Program, "U_Matrix.Projection");
        this.Normal     = GL.getUniformLocation(Program, "U_Matrix.Normal");
    }
}

class AmbientUniforms
{
    public readonly Colour:     WebGLUniformLocation;
    public readonly Intensity:  WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Colour     = GL.getUniformLocation(Program, "U_Ambient.Colour");
        this.Intensity  = GL.getUniformLocation(Program, "U_Ambient.Intensity");
    }
}

class DirectionalUniforms
{
    public readonly Colour:     WebGLUniformLocation;
    public readonly Intensity:  WebGLUniformLocation;
    public readonly Direction:  WebGLUniformLocation;
    
    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Colour     = GL.getUniformLocation(Program, "U_Directional.Colour");
        this.Intensity  = GL.getUniformLocation(Program, "U_Directional.Intensity");
        this.Direction  = GL.getUniformLocation(Program, "U_Directional.Direction");
    }
}

class PointUniforms
{
    public readonly Colour:     WebGLUniformLocation;
    public readonly Intensity:  WebGLUniformLocation;
    public readonly Position:   WebGLUniformLocation;
    public readonly Radius:     WebGLUniformLocation;
    public readonly Angle:      WebGLUniformLocation;
    
    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null, index: number)
    {
        this.Colour     = GL.getUniformLocation(Program, `U_Point[${index}].Colour`);
        this.Intensity  = GL.getUniformLocation(Program, `U_Point[${index}].Intensity`);
        this.Position   = GL.getUniformLocation(Program, `U_Point[${index}].Position`);
        this.Radius     = GL.getUniformLocation(Program, `U_Point[${index}].Radius`);
        this.Angle      = GL.getUniformLocation(Program, `U_Point[${index}].Angle`);
    }
}

class LightUniforms
{
    public readonly Ambient:        AmbientUniforms;
    public readonly Directional:    DirectionalUniforms;
    public readonly Point:          Array<PointUniforms> = new Array<PointUniforms>(8);
    public readonly PointCount:     WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Ambient        = new AmbientUniforms(GL, Program);
        this.Directional    = new DirectionalUniforms(GL, Program);
        this.PointCount     = GL.getUniformLocation(Program, `U_PointCount`);

        for (var i: number = 0; i < 8; ++i)
            this.Point[i]   = new PointUniforms(GL, Program, i);
    }
}

class SamplerUniforms
{
    public readonly Image:      WebGLUniformLocation;
    public readonly Bump:       WebGLUniformLocation;
    public readonly Specular:   WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Image      = GL.getUniformLocation(Program, "U_Sampler.Image");
        this.Bump       = GL.getUniformLocation(Program, "U_Sampler.Bump");
        this.Specular   = GL.getUniformLocation(Program, "U_Sampler.Specular");
    }
}

class ShaderUniforms
{
    public readonly Material:   MaterialUniforms;
    public readonly Matrix:     MatrixUniforms;
    public readonly Light:      LightUniforms;
    public readonly Sampler:    SamplerUniforms;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Material   = new MaterialUniforms(GL,  Program);
        this.Matrix     = new MatrixUniforms(GL,    Program);
        this.Light      = new LightUniforms(GL,     Program);
        this.Sampler    = new SamplerUniforms(GL,   Program);
    }
}

/**
 * @name        Shader
 * @module      FWGE.Render
 * @description This object links with the vertex and fragment shaders
 */
class Shader extends Item
{
    public static Shaders: Array<Shader> = new Array<Shader>();

    /**
     * @property    Program: {WebGLProgram} [read]
     * @description Some description
     */
    public readonly Program: WebGLProgram | null;

    /**
     * @property    Texture: {WebGLTexture} [read]
     * @description Some description
     */
    public readonly Texture: WebGLTexture | null;

    /**
     * @property    FrameBuffer: {WebGLFramebuffer} [read]
     * @description Some description
     */
    public readonly FrameBuffer: WebGLFramebuffer | null;

    /**
     * @property    RenderBuffer: {WebGLRenderbuffer} [read]
     * @description Some description
     */
    public readonly RenderBuffer: WebGLRenderbuffer | null;

    /**
     * @property    Height: {Number} [read]
     * @description Some description
     */
    public readonly Height: number;

    /**
     * @property    Width: {Number} [read]
     * @description Some description
     */
    public readonly Width: number;

    /**
     * @property    Width: {Number} [read]
     * @description Some description
     */
    public readonly Attributes: ShaderAttributes;
    /**
     * @property    Width: {Number} [read]
     * @description Some description
     */
    public readonly Uniforms:   ShaderUniforms;

    constructor(request: IShader)
    {
        console.log(request);
        super(request.Name);

        this.Program = FWGE.GL.createProgram();
        this.Texture = FWGE.GL.createTexture();
        this.FrameBuffer = FWGE.GL.createFramebuffer();
        this.RenderBuffer = FWGE.GL.createRenderbuffer();
        this.Height = request.Height || 1024;
        this.Width = request.Width || 1024;

        if (this.Init(FWGE.GL, request.VertexShader, request.FragmentShader))
        {
            FWGE.GL.useProgram(this.Program);
            this.Attributes = new ShaderAttributes(FWGE.GL, this.Program);
            this.Uniforms = new ShaderUniforms(FWGE.GL, this.Program);   
            FWGE.GL.useProgram(null);
        }

        Shader.Shaders.push(this);
    };

    private Init(GL: WebGLRenderingContext, vertexShader: string, fragmentShader: string): boolean
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer); 
        GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer);
        GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height);
        GL.bindTexture(GL.TEXTURE_2D, this.Texture);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined);
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0);
        GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer);  
                    
        GL.bindTexture(GL.TEXTURE_2D, null);
        GL.bindRenderbuffer(GL.RENDERBUFFER, null);
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);        
        
        var vs = GL.createShader(GL.VERTEX_SHADER);
        GL.shaderSource(vs, vertexShader);
        GL.compileShader(vs);
        if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
        {
            console.error(new Error("Vertex Shader: " + GL.getShaderInfoLog(vs)));
            return false;
        }
        
        var fs = GL.createShader(GL.FRAGMENT_SHADER);
        GL.shaderSource(fs, fragmentShader);
        GL.compileShader(fs);
        if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
        {
            console.error(new Error("Fragment Shader: " + GL.getShaderInfoLog(fs)));
            return false;
        }
        
        GL.attachShader(this.Program, vs);
        GL.attachShader(this.Program, fs);
        GL.linkProgram(this.Program);
        if (!GL.getProgramParameter(this.Program, GL.LINK_STATUS))
            return false;

        return true;
    }
}
















/**
 * @name        Renderer
 * @description This module handles the actual rendering of the scene to
 *              the screen.
 * @module      FWGE.Render
 */
class Renderer
{
    private ProjectionMatrix: Matrix4;
    private ModelViewMatrix: Matrix4;
    private NormalMatrix: Matrix3;

    public Projection: Projection = new Projection();
    private ModelView: ModelView = new ModelView();
    private WireframeShader: Shader;

    constructor()
    {
        this.ProjectionMatrix = Matrix4.Identity;
        this.ModelViewMatrix = Matrix4.Identity;
        this.NormalMatrix = Matrix3.Identity;
        this.WireframeShader = new Shader(
        {
            Name: "Wireframe Shader",
            VertexShader: "attribute vec3 A_Position;struct Matrix{mat4 ModelView;mat4 Projection;};uniform Matrix U_Matrix;void main(void){gl_Position=U_Matrix.Projection*U_Matrix.ModelView*vec4(A_Position,1.0);gl_PointSize=10.0;}",
            FragmentShader: "precision mediump float;void main(void){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}"
        });
    }

    public Render(): void
    {
        this.ClearBuffers();

        for (var gameObject of GameObject.Objects)
        {
            this.SetGlobalUniforms();
            this.RenderObject(gameObject);
        }

        //this.FinalDraw();
    }
    
    private ClearBuffers(): void
    {
        var i = Shader.Shaders.length;
        while (--i >= 0)
        {
            var shader = Shader.Shaders[i];

            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
            FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
            FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
        }
        
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
        FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
    }
    
    private RenderObject(gameObject: GameObject): void
    {
        this.ModelView.Push();
        this.ModelView.Peek();
        this.ModelView.Transform(gameObject.Transform);
        var mv = new Float32Array(this.ModelView.Peek().Buffer);

        for (var i: number = 0; i < gameObject.Children.length; ++i)
            this.RenderObject(gameObject.Children[i]);
        
        if (!!gameObject.Mesh && !!gameObject.Material && !!gameObject.Material.Shader)
        {
            var shader = gameObject.Material.Shader;

            FWGE.GL.useProgram(shader.Program);
            
            FWGE.GL.enableVertexAttribArray(shader.Attributes.Position);
            if (shader.Attributes.Normal !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.Normal);
            if (shader.Attributes.Colour !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.Colour);
            if (shader.Attributes.UV !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.UV);

            if (gameObject.Material.Alpha !== 1.0)
            {
                FWGE.GL.enable(FWGE.GL.BLEND);
                FWGE.GL.disable(FWGE.GL.DEPTH_TEST);
                FWGE.GL.blendFunc(FWGE.GL.SRC_ALPHA, FWGE.GL.ONE);
            }
            
            this.BindAttributes(gameObject.Mesh, shader.Attributes);
            this.SetObjectUniforms(gameObject.Material, shader.Uniforms, mv);
            this.Draw(gameObject.Mesh.VertexCount, shader.FrameBuffer);
            if (!!gameObject.Mesh.WireframeBuffer)
                this.DrawWireframe(gameObject.Mesh, mv);
            
            if (gameObject.Material.Alpha !== 1.0)
            {
                FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
                FWGE.GL.disable(FWGE.GL.BLEND);
            }
    
            FWGE.GL.disableVertexAttribArray(shader.Attributes.Position);
            if (shader.Attributes.Normal !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.Normal);
            if (shader.Attributes.Colour !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.Colour);
            if (shader.Attributes.UV !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.UV);

            FWGE.GL.useProgram(null);
        }
            
        this.ModelView.Pop();
    }

    private BindAttributes(mesh: Mesh, attributes: any)
    {
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
        FWGE.GL.vertexAttribPointer(attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
        
        if (attributes.UV !== -1)
        {
            if (!!mesh.UVBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.UVBuffer);
                FWGE.GL.vertexAttribPointer(attributes.UV, 2, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.UV);
        }
        
        if (attributes.Colour !== -1)
        {
            if (!!mesh.ColourBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                FWGE.GL.vertexAttribPointer(attributes.Colour, 3, FWGE.GL.FLOAT, false, 0, 0);                            
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.Colour);
        }
        
        if (attributes.Normal !== -1)
        {
            if (!!mesh.NormalBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                FWGE.GL.vertexAttribPointer(attributes.Normal, 3, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.Normal);
        }
        
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
    }

    private SetObjectUniforms(material: RenderMaterial, uniforms: any, mv: Float32Array)
    {
        FWGE.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
        FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, this.CalculateNormalMatrix().Buffer);

        FWGE.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient.Buffer);
        FWGE.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse.Buffer);
        FWGE.GL.uniform4fv(uniforms.Material.Specular, material.Specular.Buffer);
        FWGE.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
        FWGE.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
    
        if (!!material.ImageMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.ImageMap);
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Image, 0);
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 0);
        }
        
        if (!!material.BumpMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.BumpMap);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Bump, 1);
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
        
        if (!!material.SpecularMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.SpecularMap);
            FWGE.GL.uniform1i(uniforms.Material.HasSpecular, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Specular, 2);
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
    }

    private SetGlobalUniforms(): void 
    {            
        var i = Shader.Shaders.length;
        while (--i >= 0)
        {
            var point_count = 0;
            
            FWGE.GL.useProgram(Shader.Shaders[i].Program);
            var uniforms = Shader.Shaders[i].Uniforms.Light;
            
            for (var j: number = 0; j < Light.Lights.length; ++j)
            {
                var light: LightItem | null = Light.Lights[j];
                
                if (light instanceof AmbientLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour.Buffer);
                    FWGE.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                }
                else if (light instanceof DirectionalLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Directional.Colour, light.Colour.Buffer);
                    FWGE.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                    FWGE.GL.uniform3fv(uniforms.Directional.Direction, light.Direction.Buffer);
                }
                else if (light instanceof PointLight)
                {
                    this.ModelView.Push();
                    this.ModelView.Transform(light.GameObject.Transform);
                    var pos = this.ModelView.Pop();

                    FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour.Buffer);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                    FWGE.GL.uniform3f(uniforms.Point[point_count].Position, pos.M41, pos.M42, pos.M43);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);

                    point_count++;
                }
            }

            FWGE.GL.uniform1i(uniforms.PointCount, point_count);
            
            // SET UNIFORM FOR NUMBER OF POINT LIGHTS
            FWGE.GL.uniformMatrix4fv(Shader.Shaders[i].Uniforms.Matrix.Projection, false, this.Projection.ViewerMatrix.Buffer);
        }
        
        FWGE.GL.useProgram(null);
    }

    private CalculateNormalMatrix()
    {
        var mat: Matrix4 = this.ModelView.Peek();
        mat.Inverse();

        return new Matrix3().Set
        (
            mat.M11, mat.M21, mat.M31,
            mat.M12, mat.M22, mat.M32,
            mat.M13, mat.M23, mat.M33
        );
    }

    private Draw(vertexCount: number, framebuffer: WebGLFramebuffer | null)
    {
        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_SHORT, 0);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
    }
    
    private DrawWireframe(mesh: Mesh, mv: Float32Array)
    {
        FWGE.GL.useProgram(this.WireframeShader.Program);
        
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
        FWGE.GL.vertexAttribPointer(this.WireframeShader.Attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer);
        
        FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.ModelView, false, mv);
        FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.Projection, false, this.Projection.ViewerMatrix.Buffer);
        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.drawElements(FWGE.GL.LINES, mesh.WireframeCount, FWGE.GL.UNSIGNED_SHORT, 0);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.useProgram(null);
    }
    /*FinalDraw(): void
    {
        FWGE.GL.useProgram(_Shader.Program);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);

        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _Shader.PositionBuffer);
        FWGE.GL.vertexAttribPointer(_Shader.PositionPointer, 3, FWGE.GL.FLOAT, false, 0, 0);

        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _Shader.UVBuffer);
        FWGE.GL.vertexAttribPointer(_Shader.UVPointer, 2, FWGE.GL.FLOAT, false, 0, 0);

        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, _Shader.IndexBuffer);

        FWGE.GL.uniformMatrix4fv(_Shader.ModelView, false, this.ModelView.Peek().Buffer);
        FWGE.GL.uniformMatrix4fv(_Shader.Projection, false, this.Projection.GetViewer());

        var i =Shader.Shaders.length;
        FWGE.GL.uniform1i(_Shader.SamplerCount, 1);
        FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
        FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, Shader.Shaders[0].Texture);
        FWGE.GL.uniform1i(_Shader.Samplers[0], 0);

        while (--i >= 0)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0 + i);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, Shader.Shaders[i].Texture);
            FWGE.GL.uniform1i(_Shader.Samplers[i], i);
        }
        
        FWGE.GL.drawElements(FWGE.GL.TRIANGLES, 6, FWGE.GL.UNSIGNED_SHORT, 0);
        
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.useProgram(null);
    }*/
}







class OBJConverter extends Converter
{
    public Parse(obj: string, mtl: string): GameObject
    {
        var object_name = obj.split(/(\/|\\)/).filter(function(string){if (string.indexOf('.obj') !== -1) return string;})[0].replace('.obj', '');
        var self: OBJConverter = this;
        var OBJ: Array<string> = this.Read(obj).split('\n');
        var MTL: Array<string> = this.Read(mtl).split('\n');
        var Children: Array<GameObject> = new Array<GameObject>();
        var Materials: any = {};
        var Meshes: any = {};

        var curr: number = -1;
        var name: string = "";
        MTL.forEach(function(item, index, array)
        {
            if (item.indexOf('newmtl') !== -1)
            {
                if (curr !== -1)
                    Materials[name] = MTL.slice(curr, index).join('\n');

                curr = index;
                name = item.split(' ')[1].trim();
            }

            if (index === array.length - 1)
                Materials[name] = MTL.slice(curr, array.length).join('\n');
        });

        curr = -1;
        OBJ.forEach(function(item, index, array)
        {
            if (item.indexOf('o ') !== -1)
            {
                if (curr !== -1)
                    Meshes[name] = OBJ.slice(curr, index).join('\n');

                curr = index;
                name = item.split(' ')[1].trim();
            }

            if (index === array.length - 1)
                Meshes[name] = OBJ.slice(curr, array.length).join('\n');
        });

        Object.keys(Materials).forEach(function(key, index, array) { Materials[key] = self.RenderMaterial(Materials[key]); });
        Object.keys(Meshes).forEach(function(key, index, array)
        {
            var mesh = self.Mesh(Meshes[key]);
            var material = Meshes[key].split('\n').filter(function(item){if(item.indexOf('usemtl ')!==-1)return item;}).join('').replace('usemtl ', '');

            Children.push(new GameObject(
            {
                Name: mesh.Name,
                Mesh: mesh,
                Material: Materials[material]
            }));
        });

        if (Children.length === 1)
            return Children.pop();

        return new GameObject(
        {
            Name: object_name,
            Children: Children
        });
    }
    
    protected GameObject(mesh: Mesh, materials: Array<RenderMaterial>, meshes: string[]): GameObject
    {
        return new GameObject();
    }

    protected Mesh(obj: string): Mesh
    {
        var lines = obj.split('\n');
        var vertices = [];
        var normals = [];
        var uvs = [];
        var request: IMesh = new IMesh();
        var face_offset = 0;
        var wireframe_offset = 0;
        
        for (var i = 0; i < lines.length; ++i)
        {
            var line = lines[i];
            var type = line.split(' ')[0];
            var value = line.substring(type.length).trim();
            var values = value.split(' ');

            switch (type)
            {
                case "o":
                    request.Name = value;
                break;
                
                case "v":
                    vertices.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                break;
                
                case "vn":
                    normals.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                break;
                
                case "vt":
                    uvs.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                break;

                case "f":
                    values.forEach(function(face, index, array)
                    {
                        var face_i = face.split('/').map(function(item)
                        { 
                            var val = parseInt(item);
                            
                            if (!isNaN(val))
                                return val - 1;

                            return NaN;
                        });

                        if (!isNaN(face_i[0]))
                            request.Position = request.Position.concat(vertices[face_i[0]]);
                        
                        if (!isNaN(face_i[1]))
                            request.UVs = request.UVs.concat(uvs[face_i[1]]);
                        
                        if (!isNaN(face_i[2]))
                            request.Normals = request.Normals.concat(normals[face_i[2]]);

                        if (index >= 2)
                            request.Indices.push(face_offset, face_offset + index - 1, face_offset + index);
                    });
                    
                    for (var j = 0; j < values.length; ++j)
                    {
                        if (j === values.length - 1)
                            request.Wireframe.push(wireframe_offset + j, wireframe_offset);
                        else
                            request.Wireframe.push(wireframe_offset + j, wireframe_offset + j + 1);
                    }
                    wireframe_offset += values.length;
                    face_offset += values.length;
                break;
            }
        }

        return new Mesh(request);
    }
    
    protected RenderMaterial(mtl: string): RenderMaterial
    {
        var lines = mtl.split('\n');
        var request: IRenderMaterial = new IRenderMaterial();

        for (var i = 0; i < lines.length; ++i)
        {
            var line = lines[i];
            var type = line.split(' ')[0];
            var value = line.substring(type.length).trim();
            var values = value.split(' ');

            switch (type)
            {
                case 'newmtl':
                    request.Name = value;
                break;

                case 'Ns':
                    request.Shininess = parseFloat(value);
                break;

                case 'Ka':
                    request.Ambient = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                break;

                case 'Kd':
                    request.Diffuse = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                break;

                case 'Ks':
                    request.Specular = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                break;
                
                case 'd':
                    request.Alpha = parseFloat(value);
                break;

                case 'Tr':
                    request.Alpha = 1 - parseFloat(value);
                break;
            }
        }

        return new RenderMaterial(request);
    }
}










/**
 * @name RenderEngine
 * @description This module contains all the visual related aspects of the 
 *              game engine.
 * @module      FWGE 
 */
class RenderEngine
{
    private Renderer: Renderer;
    public OBJConverter: OBJConverter;

    /**
     * @property    Colour: {Colour}
     * @description This module creates colour arrays.
     * @see         FWGE.Render.Colour
     */
    public Colour(...args: any[]): Colour
    {
        return new Colour(args);
    }

    /**
     * @property    Mesh: {Function}
     * @description This is the constructor for a Mesh object.
     * @see         FWGE.Render.Mesh
     */
    public Mesh(request: IMesh): Mesh
    {
        return new Mesh(request);
    }

    /**
     * @property    RenderMaterial: {Function}
     * @description This is the constructor for a Render Material.
     * @see         FWGE.Render.RenderMaterial
     */
    public RenderMaterial(request: IRenderMaterial): RenderMaterial
    {
        return new RenderMaterial(request);
    }
    
    /**
     * @property    Shader: {Function}
     * @description This is a constructor for a Shader object.
     * @see         FWGE.Render.Shader
     */
    public Shader(request: IShader): Shader
    {
        return new Shader(request);
    }

    /**
     *  @function       Init: {undefined}
     *  @description    Initializes the rendering engine
     */
    public Init(): void
    {
        this.Renderer = new Renderer();
        this.OBJConverter = new OBJConverter();
        FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
    }

    /**
     *  @function       RenderUpdate: {undefined}
     *  @description    Updates the rendering to the screen
     */
    Update(Game: GameEngine): void
    {
        this.Renderer.Render();
        this.Renderer.Projection.Update(Game.Camera.Mode, Game.Camera)
    }
}





interface IFWGE
{
    Canvas:     HTMLCanvasElement;
    Height?:    number;
    Width?:     number;
    Clear:      Array<number>;
}

/**
 * @name        FWGE
 * @module      {}
 * @description Some description.
 */
class FWGE
{
    public static GL: WebGLRenderingContext;

    /**
     * @type        {GameEngine}
     * @description The main engine.
     * @see         FWGE.Game
     */
    public Game: GameEngine;

    /**
     * @type        {PhysicsEngine}
     * @description The physics engine.
     * @see         FWGE.Physics
     */
    public Physics: PhysicsEngine;

    /**
     * @type        {RenderEngine}
     * @description The rendering engine.
     * @see         Render
     */
    public Render: RenderEngine;

    constructor()
    {
        this.Game       = new GameEngine();
        this.Physics    = new PhysicsEngine();
        this.Render     = new RenderEngine();
    }

    /**
     * @description Initializes the webgl context and the seperate engines
     * @function    Init
     * @param       {IFWGE}             request
     * @param       {HTMLCanvasElement} request.canva
     * @param       {Number}            request.heigh
     * @param       {Number}            request.width
     * @param       {Float32Array}      request.clear
     * @return      {void}
     */
    Init(request: IFWGE): void
    {
        if (!request.Canvas)
            throw new Error("HTMLCanvasElement field (canvas) required");

        var _context = request.Canvas.getContext("webgl") || request.Canvas.getContext("experimental-webgl");

        if (!_context)
            throw new Error("Webgl context could not be initialized.");

        
        FWGE.GL = _context;
        FWGE.GL.clearColor(request.Clear[0], request.Clear[1], request.Clear[2], request.Clear[3]);

        this.Game.Init(request.Canvas);
        this.Physics.Init();
        this.Render.Init();
    }

    Start(): void
    {
        this.Game.Start(this.Game, this.Physics, this.Render);
    }

    Pause(): void
    {
        this.Game.Pause();
    }

    Stop(): void
    {
        this.Game.Stop();
    }
}
