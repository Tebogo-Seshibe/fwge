import List from './List';
export default class ListUtiils {
    static FlattenVector(list) {
        let flattened = new List();
        for (let list_item of list) {
            flattened.AddMany(...list_item);
        }
        return flattened;
    }
}
//# sourceMappingURL=ListUtils.js.map