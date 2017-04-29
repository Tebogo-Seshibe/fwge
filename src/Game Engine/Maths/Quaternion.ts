export class Quaternion
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
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
    }
}
