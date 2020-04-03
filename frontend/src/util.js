
export function formatDate(date){
    let pad = (n) => (n+"").padStart(2,"0");
    return `${pad(date.getMonth())}/${pad(date.getDate())}`;
}
export function formatTime(date){
    return date.getHours()+":"+(date.getMinutes()+"").padStart(2,"0");
}
export function getDayName(date){
    let day = 0;
    
    if (typeof date != "object"){
        date = new Date(date);
    }
    day = date.getDay();

    let names = ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat"];
    return names[day];
}