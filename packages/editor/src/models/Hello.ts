export function Hello(): ClassDecorator {
    console.log(Reflect);    
    return function (target: Object): void {
        const keys = Reflect.getMetadataKeys(target);
        console.log(keys);
        keys.forEach(key => console.log(Reflect.getMetadata(key, target)));
    }
}

@Hello()
export class Person {
    constructor(
        public name: string,
        public surname: string,
        public age: number,
        public mother?: Person,
        public father?: Person
    ) {}
}
