
export function formatDate(date){
    date = toDate(date);
    let pad = (n) => (n+"").padStart(2,"0");
    return `${pad(date.getMonth())}/${pad(date.getDate())}`;
}
export function formatTime(date){
    date = toDate(date);
    return date.getHours()+":"+(date.getMinutes()+"").padStart(2,"0");
}
export function toDate(date){
    if (typeof date != "object"){
        date = new Date(date);
    }
    return date;
}
window.toDate = toDate;
export function getDayName(date){
    date = toDate(date);

    let day = 0;
    day = date.getDay();

    let names = ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat"];
    return names[day];
}
export function getDayShortName(date){
    date = toDate(date);

    let day = 0;
    day = date.getDay();

    let names = ["V","H","K","Sz","Cs","P","Sz"];
    return names[day];
}