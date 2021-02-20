import { openNote } from '../components/modals/NoteModal';
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

        function shorten(text) {
            let limit = 70;
            if (text.length > limit) {
                let textarr = text.slice(0, limit).split(" ");
                textarr.pop();
                return textarr.join(" ") + "...";
            } else {
                return text;
            }
        }

        this.header = this.title;
        this.desc = shorten(this.content);
        this.icon = "fi/message-square";
    }
}
