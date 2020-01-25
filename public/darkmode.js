

function isDark(){
    let dark = false;
    if (localStorage.getItem("darkmode") == null){
        if (window.matchMedia("(prefers-color-scheme: dark)").matches){
            dark = true;
        }
    } else if (localStorage.getItem("darkmode") == "true"){
        dark = true;
    }
    return dark;
}

var themecss  = document.createElement('link');
function setLight(){
    themecss.href = 'css/light.css';
    localStorage.setItem("darkmode","false");
}
function setDark(){
    themecss.href = 'css/dark.css';
    localStorage.setItem("darkmode","true");
}
function toggleDarkMode(){
    if (isDark()){
        setLight();
    } else {
        setDark();
    }
}

{
    var head  = document.getElementsByTagName('head')[0];
    
    let link = themecss;
    link.id   = 'themecss';
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    if (isDark()){
        setDark();
    } else {
        setLight();
    }
    
    link.media = 'all';
    head.appendChild(link);
}
