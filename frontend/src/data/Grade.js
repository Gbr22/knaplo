
import { Subject } from './Subject';
import { KretaType, nullOrNew } from './util';

export class Grade {
    teacherName;
    form;
    nature;
    createDate;
    seenDate;
    mode;
    date;
    weight;
    numberValue;
    textValue;
    textValueShortName;
    subject;
    theme;
    type;
    group;
    sortIndex;
    id;

    static types = {
        "midYear": "evkozi_jegy_ertekeles",
        "firstQ": "I_ne_jegy_ertekeles",
        "secondQ": "II_ne_jegy_ertekeles",
        "halfYear": "felevi_jegy_ertekeles",
        "thirdQ": "III_ne_jegy_ertekeles",
        "fourthQ": "IV_ne_jegy_ertekeles",
        "endYear": "evvegi_jegy_ertekeles",
    };

    static forms = {
        evaluation:"1,Osztalyzat",
        behavior:"4,MagatartasErtek",
        diligence:"5,SzorgalomErtek",
    }

    isType(type) {
        if (this.type?.id){
            return this.type.id.split(",")[1] == type;
        }
        return false;
    }

    obj;

    constructor(o){
        Object.assign(this,{
            obj:o,
            teacherName: o.ErtekeloTanarNeve,
            form: nullOrNew(o.ErtekFajta,KretaType),
            nature: o.Jelleg,
            createDate: nullOrNew(o.KeszitesDatuma,Date),
            seenDate: nullOrNew(o.LattamozasDatuma,Date),
            mode: nullOrNew(o.Mod,KretaType),
            date: nullOrNew(o.RogzitesDatuma,Date),
            weight: o.SulySzazalekErteke,
            numberValue: o.SzamErtek,
            textValue: o.SzovegesErtek,
            textValueShortName: o.SzovegesErtekelesRovidNev,
            subject: nullOrNew(o.Tantargy,Subject),
            theme: o.Tema,
            type: nullOrNew(o.Tipus, KretaType),
            group: nullOrNew(o.OsztalyCsoport,Group),
            sortIndex: o.SortIndex,
            id: o.Uid,
        })
    }

    get forcedNumberValue(){
        if (this.numberValue){
            return this.numberValue;
        } else {
            let map = {
                "Példás":5,
                "Jó":4,
                "Változó":3,
                "Rossz":2,
                "Hanyag":2,
            }
            let num = map[this.textValue] || null;
            return num;
        }
    }
}

class Group {
    id;

    obj;

    constructor(o){
        this.obj = o;
        this.id = o.Uid;
    }
}
