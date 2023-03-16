export const kebabCase = /[a-z]+((-[a-z])([a-z]*))*/;

export const Name = (kebab: string) => {

    
    const match = kebabCase.test(kebab);
    
    if (!match) {
        throw "Invalid name. Must be kebab case."
    }
    
    let pascal = kebab[0].toUpperCase();
    let casing = false;
    for (let i = 1; i < kebab.length; ++i) {
        if (kebab[i] === '-') {
            casing = true;
        } else if (casing) {
            casing = false;
            pascal += kebab[i].toUpperCase();
        } else {
            pascal += kebab[i];
        }
    }
    return { kebab, pascal };
}