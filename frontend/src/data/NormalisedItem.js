export class NormalisedItem {

    obj=null;

    createDate;
    date;
    
    type="normal";
    
    key;

    header;
    icon="text/#";
    desc;

    displayState;

    onclick(){}

    map(map){
        for (let p in map){
            this[p] = this.obj[map[p]];
        }        
    }

    constructor(o) {
        this.obj = o;
        this.createDate = o.KeszitesDatuma || o.BejelentesDatuma;
        this.date = o.Datum || o.RogzitesDatuma;



        this.key = this.type+this.obj.Uid;
    }
}