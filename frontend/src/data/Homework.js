export class Homework {
    id;
    constructor(json) {
        this.id = json.Uid;
        Object.assign(this, json);
    }
}
