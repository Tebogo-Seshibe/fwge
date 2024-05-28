import { type TypeId } from "./Component";

export type Type<T extends any = {}> =
{
    new(...args: any[]): T;
    prototype?: Partial<T>;
    readonly name: string;
};

export type Class<T extends any = {}> =
{
    new(...args: any[]): T;
    prototype?: Partial<T>;
    readonly TypeId: TypeId;
    readonly name: string;
};

export type Constructor<T, U extends ConstructorParameters<Class<T>> = any[]> =
{
    new(...args: U): T;
    prototype: Partial<T>;
    readonly TypeId: TypeId;
    readonly name: string;
};
