import { openNote } from '../components/modals/NoteModal';
import { htmlToText, shortenText, toOneLine } from '../util';
import { NormalisedItem } from './NormalisedItem';

export class Note extends NormalisedItem {
    type = "note";

    title;
    content;
    teacher;
    noteType;

    onclick() {
        openNote(this);
        /* openModal(this.title,formatURLsHTML(this.content)); */
    }

    constructor(o) {
        super(o);
        this.map({
            title: "Cim",
            content: "Tartalom",
            teacher: "KeszitoTanarNeve",
        });
        this.noteType = o.Tipus?.Leiras;


        this.header = this.title;
        this.desc = shortenText(toOneLine(htmlToText(this.content)),70);
        this.icon = "fi/message-square";
    }
}
