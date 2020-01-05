function formatDate(d){
    function f(n){
        if (n < 10){
            return "0"+n;
        }
        return n;
    }
    return `${f(d.getMonth()+1)}/${f(d.getDate())}`;
}
function getDayOfWeek(d){
    let days = ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat"];
    //Sunday first is important


    return days[d.getDay()];
}
