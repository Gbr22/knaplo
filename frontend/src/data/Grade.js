import { openGrade } from '../components/modals/GradeModal';
import { NormalisedItem } from './NormalisedItem';

export class Grade extends NormalisedItem {

    type = "grade";
    value;
    textValue;
    teacher;
    theme;
    mode;
    normal = true;
    weight = null;
    gradeType;
    gradeTypeName;
    form;
    formName;
    subject;
    subjectId;
    types = {
        "midYear": "evkozi_jegy_ertekeles",
        "firstQ": "I_ne_jegy_ertekeles",
        "secondQ": "II_ne_jegy_ertekeles",
        "halfYear": "felevi_jegy_ertekeles",
        "thirdQ": "III_ne_jegy_ertekeles",
        "fourthQ": "IV_ne_jegy_ertekeles",
        "endYear": "evvegi_jegy_ertekeles",
    };
    isType(type) {
        return this.gradeType.split(",")[1] == this.types[type];
    }


    onclick() {
        openGrade(this);
    }

    constructor(o) {
        super(o);
        this.map({
            value: "SzamErtek",
            teacher: "ErtekeloTanarNeve",
            form: "Jelleg",
            formName: "FormName",
            theme: "Tema",
            textValue: "SzovegesErtek",
            weight: "SulySzazalekErteke",
        });
        this.formName = o.ErtekFajta?.Leiras;
        this.mode = o.Mod?.Leiras;
        this.subject = o.Tantargy?.Nev;
        this.subjectId = o.Tantargy?.Uid;
        this.gradeType = o.Tipus?.Uid;
        this.gradeTypeName = o.Tipus?.Leiras;
        if (this.form == "Magatartas" || this.form == "Szorgalom") {
            this.normal = false;
            if (this.subject == "Magatartas") {
                this.subject = "Magatartás";
            }
            if (this.textValue == "Jó" || this.textValue == "Példás") {
                this.icon = "fi/smile";
            } else {
                this.icon = "fi/frown";
            }
        } else {
            this.icon = "text/" + this.value;
        }
        if (!this.icon) {
            this.icon = "#";
        }
        this.header = this.subject;
        this.desc = this.theme || this.mode || this.textValue;
        if (this.gradeType.indexOf("evkozi_jegy_ertekeles") == -1) {
            this.desc = this.gradeTypeName;
        }
        this.displayState = this.value;
    }
}
