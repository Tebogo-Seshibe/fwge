export const classComponent = 'fwge:component';
export function EditorEntity() {
    return function (base) {
        const constructor = base;
        return new Proxy(base, {
            construct(o, argArray, n) {
                const entity = new constructor(...argArray);
                const components = Reflect.getMetadata(classComponent, constructor);
                for (const [, { propertyKey, component }] of components.entries()) {
                    const comp = component();
                    entity.AddComponent(comp);
                    Reflect.defineProperty(entity, propertyKey, {
                        value: comp
                    });
                }
                Reflect.deleteMetadata(classComponent, constructor);
                return entity;
            },
        });
    };
}
