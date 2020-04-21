import { closeModal } from './components/Modal.vue';


export function formatDate(date){
    date = toDate(date);
    let pad = (n) => (n+"").padStart(2,"0");
    return `${pad(date.getMonth()+1)}/${pad(date.getDate())}`;
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
window.shortenText = shortenText;
export function htmlToText(s){
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
}
export function toOneLine(s){
    return s.replace(/\n/g,'').replace(/ +(?= )/g,'');
}
window.htmlToText = htmlToText;
export function formatURLs(text){
    /* let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g; */
    let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    
    
    return text.replace(regex, function(match){
        return /* html */`<a href="${match}" class="link" target="_blank" data-fURL>${match}</a>`;
    });
    
}
export function ratioImg(width,height, color){
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0,0,width,height);
    return canvas.toDataURL();
}
export function isSelfClosing(tagname){
    return !document.createElement(tagname).outerHTML.includes("/");
}
function addEmbedPlayer(id){
    console.log(id);
    let div = document.createElement("div");
    div.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen>
        </iframe>
    `;
    let thumb = document.querySelector(`[data-id='${id}'].thumbnail`);
    thumb.remove();
    document.querySelector(`[data-id='${id}']`).appendChild(div.children[0]);
}
window.addEmbedPlayer = addEmbedPlayer;
export function formatURLsHTML(html){
    
    let tag = document.createElement("span");
    tag.innerHTML = html;
    let inital = tag.innerText;

    let links = tag.querySelectorAll("a[href]");
    let hasHTML = code => /<\/?[a-z][\s\S]*>/i.test(code);
    if (links.length == 0 && !hasHTML(html)){
        html = formatURLs(html);
        tag.innerHTML = html;
    }
    let tags = tag.querySelectorAll("*");

    //cleanup
    for (let t of tags){
        function removeParent(){
            t.parentElement.insertBefore(t.childNodes[0],t);
            t.remove();
        }
        if (t.attributes.length == 0 && t.childNodes.length == 1 && t.parentElement == tag){
            let tagnames = [
                "div",
                "table","tbody","tr","td",
                "dl","dd"
            ];
            if (tagnames.includes(t.tagName.toLowerCase())){
                removeParent();
            }
        }
        else if (!isSelfClosing(t.tagName) && t.innerHTML == ""){
            t.remove();
        } else if (t.innerHTML == "<br>"){
            removeParent();
        }
    }

    //make sure no content is lost in the cleanup

    let now = tag.innerText;
    if (inital == now){
        let smaller = html.length-tag.innerHTML.length;
        /* console.log(`${smaller} smaller!`); */
    } else {
        console.error("Content lost!", "Inital:",inital, "Now:",now);
        tag.innerHTML = html; //if content is lost reset
    }

    //link formatting

    tags = tag.querySelectorAll("*");

    for (let t of tags){
        let onlybr = [...t.children].every(e=>e.tagName.toLowerCase() == "br");


        if (!hasHTML(t.innerHTML) || onlybr){
            t.innerHTML = formatURLs(t.textContent);
        }
    }

    links = tag.querySelectorAll("a[href]");
    links.forEach((l)=>{
        let url = l.getAttribute("href");
        if (url == l.textContent){
            l.innerHTML = new URL(url).hostname;
        }
        l.classList.add("link");
        l.setAttribute("target","_blank");
    })
    let youtubelinks = tag.querySelectorAll('a[href*="youtube.com"]');
    for (let e of youtubelinks){
        let id = (new URL(e.getAttribute("href"))).searchParams.get("v");
        let d = document.createElement("div");
        e.parentNode.replaceChild(d, e);
        d.classList.add("youtubeEmbed");
        d.setAttribute("data-id",id);
        d.innerHTML = `
            <canvas width="16" height="9" class="ratio"></canvas>
            <div style="background-image: url(${`https://i.ytimg.com/vi/${id}/hqdefault.jpg`})" data-id="${id}" class="thumbnail" onclick="addEmbedPlayer('${id}')">
                <div class="play">
                </div>
            </div>
            <span>[YouTube]</span>
            
        `;
    }
    html = tag.innerHTML;
    return html;
}
window.formatURLsHTML = formatURLsHTML;
export function navigate(navTo){
    closeModal();
    let to = navTo;
    GlobalState.currentMenu = to;
    localStorage.setItem("currentMenu",to);
}
export function getFiURL(fi){
    let url = "feather-sprite.svg"
    if (!fi){
        return url;
    } else {
        return url+fi.replace("/fi#","#").replace("fi#","#");
    }

}
export function getCookieFromString(cname,string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(string);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
window.getCookieFromString = getCookieFromString;