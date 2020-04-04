
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
export function shortenText(s,limit){
    let words = s.split(" ");
    let result = null;
    while(words.join(" ").length > limit){
        if (words.length == 1){
            result = words[0].slice(0,limit);
        }
        words.pop();
    }
    if (result == null){
        result = words.join(" ");
    }
    if (result != s){
        return result+"...";
    } else {
        return result;
    }
}
export function htmlToText(s){
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
}
export function formatURLs(text){
    let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
    
    
    return text.replace(regex, function(match){
        return /* html */`<a href="${match}" class="link" target="_blank" data-fURL>${match}</a>`;
    });
    
}