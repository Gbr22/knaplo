import { NormalisedItem } from "./NormalisedItem";
import { KretaType } from './util';
import { openTest } from '../components/modals/TestModal';

export class Test extends NormalisedItem {
    lessonNumber;
    subjectName;
    theme;
    mode;
    teacherName;

    type="test";

    icon="fi/file-text";

    onclick(){
        openTest(this);
    }

    constructor(o){
        super(o);
        this.map({
            subjectName:"TantargyNeve",
            theme:"Temaja",
            lessonNumber:"OrarendiOraOraszama",
            teacherName:"RogzitoTanarNeve"
        })
        this.mode = new KretaType(o.Modja);
        this.header = `${this.mode.description} (${this.subjectName})`;
        this.desc = this.theme;
    }
}