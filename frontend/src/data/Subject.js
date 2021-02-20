export class Subject {
    name;
    average = NaN;
    grades = [];
    id;
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }
}
