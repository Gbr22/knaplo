import { htmlToText, shortenText, toOneLine } from "../util";
import { NormalisedItem } from "./NormalisedItem";
import { openEvent } from "../components/modals/EventModal";

export class Event extends NormalisedItem {
    

    type="event";

    icon="fi/calendar";

    startDate;
    endDate;
    title;
    content;
    uid;

    onclick(){
        openEvent(this);
    }

    constructor(o){
        super(o);
        this.map({
            startDate:"ErvenyessegKezdete",
            endDate:"ErvenyessegVege",
            title:"Cim",
            content:"Tartalom",
            uid:"Uid",
        });
        this.createDate = this.startDate;
        this.date = this.startDate;
        this.header = this.title;

        this.desc = shortenText(toOneLine(htmlToText(this.content)),70);
    }
}