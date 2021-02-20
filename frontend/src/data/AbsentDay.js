import { openModal } from '../components/Modal';
import AbsenceModal from '../components/modals/AbsenceModal';
import { Absence } from './Absence';

export class AbsentDay extends Absence {

    absences = [];

    push(lesson) {
        this.absences.push(lesson);
        this.absences.sort((a, b) => {
            return a.lesson - b.lesson;
        });
        let lessons = this.absences.map((e) => e.lesson);

        this.desc = `Érintett órák: ${lessons.join(", ")}`;
    }

    onclick() {
        openModal(`Hiányzások`, AbsenceModal, this);
    }

    constructor(o) {
        super(o);


        this.header = `${o.TypeName} - ${this.justified ? `Igazolt (${o.JustificationTypeName})` : 'Igazolatlan'}`;
        this.desc = "";

        this.icon = "fi/clock";
        this.displayState = this.justified;
    }


}
