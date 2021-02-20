import { NormalisedItem } from './NormalisedItem';

export class Absence extends NormalisedItem {

    type = "absence";
    absenceTypeName;
    subject;
    lesson;
    delayMinutes;
    justified;
    justificationTypeName;

    isDelay() {
        return this.absenceType == "keses";
    }

    constructor(o) {
        super(o);
        this.map({
            /* absenceType:"Type",
            subject:"Subject",
            lesson:"NumberOfLessons",
            delayMinutes:"DelayTimeMinutes", */
            delayMinutes: "KesesPercben",
            teacher: "RogzitoTanarNeve"
        });
        this.absenceType = o.Tipus?.Nev;
        this.absenceTypeName = o.Tipus?.Leiras;
        this.subject = o.Tantargy?.Nev;
        this.lesson = o.Ora?.Oraszam;
        this.justificationTypeName = o.IgazolasTipusa?.Leiras;
        this.justified = o.IgazolasAllapota == "Igazolt";



        this.header = `${this.absenceTypeName} - ${this.justified ? `Igazolt (${this.justificationTypeName})` : 'Igazolatlan'}`;
        this.desc = `${this.lesson ? `${this.lesson || "#"}. Óra - ` : ''}${this.subject}${this.isDelay() ? `, ${this.delayMinutes} perc` : ''}`;
        this.icon = "fi/clock";
        this.displayState = this.justified;
    }
}
