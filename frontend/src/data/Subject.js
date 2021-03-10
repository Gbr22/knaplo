import { KretaType } from "./util";

export class Subject {
    id;
    category;
    name;

    obj;

    constructor(o){
        Object.assign(this,{
            obj:o,

            id: o.Uid,
            category: new KretaType(o.Kategoria),
            name: o.Nev,
        });
    }
}

export class SubjectInfo {
    id;

    get info() {
        return this.grades[0].subject;
    }
    
    average = NaN;
    grades = [];

    constructor(o){
        this.id = o.id;
    }
}