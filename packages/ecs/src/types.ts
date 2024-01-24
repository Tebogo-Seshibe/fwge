import { type TypeId } from "./Component";

export type Class<T extends any = {}> = Function &
{
    new(...args: any[]): T;
    prototype?: Partial<T>;
    TypeId: TypeId;
    readonly name: string;
};

export type Constructor<T, U extends ConstructorParameters<Class<T>>> = Function &
{
    new(...args: U): T;
    prototype: Partial<T>;
    TypeId: TypeId;
    readonly name: string;
};
