export default class ArrayUtiils {
    static Flatten(list) {
        let flattened = new Array();
        for (let list_item of list) {
            if (typeof list_item === 'number') {
                flattened.push(list_item);
            }
            else {
                flattened.unshift(...list_item);
            }
        }
        return flattened;
    }
}
//# sourceMappingURL=ArrayUtils.js.map