import { closeModal } from './components/Modal.vue';
import { httpRequest } from './http';

export function tryJSON(string){
    try {
        return JSON.parse(string);
    } catch(err){
        return null;
    }
}
export function tryJSONStringify(o){
    try {
        return JSON.stringify(o);
    } catch(err){
        return null;
    }
}
export function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function getWeek(date){
    date = toDate(date);
    
    let current = date.getDay() - 1;
    if (current == -1){
        current = 6;
    }
    
    let first = addDays(date, -current);
    let last = addDays(date,-current+6);
    
    return {first,last};
}
export function getWeekIndex(weeksAfter = 0){
    let {first, last} = getWeek(new Date());
    first.setDate(first.getDate()+7*weeksAfter);
    last.setDate(last.getDate()+7*weeksAfter);
    return {first, last};
}
window.getWeek = getWeek;
export function replaceIndex(arr,i,item){
    arr.splice(i,1,item);
}
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
export function getDateCompareNumber(date){
    let pad = (n) => (n+"").padStart(2,"0");
    return parseInt(`${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}`);
}
window.getDateCompareNumber = getDateCompareNumber;
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
export function decodeHtmlEntities(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
window.decodeHtmlEntities = decodeHtmlEntities;
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
    if (!window.matchMedia(`(hover: hover) and (pointer: fine)`).matches){ //mobile
        
        let url = `https://youtube.com/watch?v=${id}`;
        window.open(url, "_blank");
        return;
    }
    console.log(id);
    let div = document.createElement("div");
    div.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allowfullscreen>
        </iframe>
    `;
    let thumb = document.querySelector(`[data-id='${id}'].thumbnail`);
    thumb.remove();
    document.querySelector(`[data-id='${id}'] .player`).appendChild(div.children[0]);
}
export function getDayOfWeek(date){
    let days = ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek"];
    return days[date.getDay()];
}
window.addEmbedPlayer = addEmbedPlayer;
export function formatURLsHTML(html){
    
    let hasHTML = code => /<\/?[a-z][\s\S]*>/i.test(code);
    let isText = !hasHTML(html);

    let tag = document.createElement("span");
    tag.innerHTML = html;

    
    
    let inital = tag.innerText;

    let links = tag.querySelectorAll("a[href]");
    
    if (links.length == 0 && isText){
        html = formatURLs(decodeHtmlEntities(html));
        tag.innerHTML = `<p>${html.split("\n").join("</p><p>")}</p>`;
    }
    
    let tags = tag.querySelectorAll("*");

    

    let now = tag.innerText;
    if (!isText){
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
        if (inital.replace(/\n/,"") == now.replace(/\n/,"")){
            let smaller = html.length-tag.innerHTML.length;
            /* console.log(`${smaller} smaller!`); */
        } else {
            console.error("Content lost!", {inital,now},{initalHTML:html,now:tag.innerHTML});
            tag.innerHTML = html; //if content is lost reset
        }
    }
    

    //link formatting

    tags = tag.querySelectorAll("*");

    if (!isText){
        for (let t of tags){
            let onlybr = [...t.children].every(e=>e.tagName.toLowerCase() == "br");
    
    
            if (!hasHTML(t.innerHTML) || onlybr){
                t.innerHTML = formatURLs(t.textContent);
            }
        }
    }

    function fetchSiteData(href){
        if (!storage.has("data/pagehtml/"+getSiteData(href))){
            setTimeout(()=>{
                getSiteData(href);
            },0);
        }
    }

    links = tag.querySelectorAll("a[href]");
    links.forEach((l)=>{
        let url = l.getAttribute("href");
        if (url == l.textContent){
            let obj = new URL(url);
            function normalLink(){
                l.innerHTML = new URL(url).hostname;
            }
            if (obj.hostname == "teams.microsoft.com" && obj.pathname == "/_"){
                try {
                    let inner = new URL(obj.hash.replace("#","about:"));
                    let path = decodeURIComponent(inner.searchParams.get("rootfolder"));
                    path = path.split("Megosztott dokumentumok/")[1];
                    if (!path){
                        throw Error();
                    }
                    l.innerHTML = path.split("/").join("<i><wbr>/</i>");
                    l.classList.add("teams");
                } catch(err){
                    normalLink();
                }
                


            } else if (url.indexOf("youtube") == -1){
                if (getSiteDataSync(url)){
                    let data = getSiteDataSync(url);
                    let d = document.createElement("button");
                    l.parentNode.replaceChild(d, l);
                    d.classList.add("embedFormat");
                    let title = data.og.title || data.title
                    let desc = data.og.description || data.desc;
                    d.setAttribute("onclick",`this.querySelector("a").click()`);
                    d.innerHTML = `
                        ${title ? `<div class="title">${shortenText(title,25)}</div>` : ''}
                        ${desc ? `<div class="desc">${shortenText(desc,40)}</div>` : ''}
                        <div class="url"><a href="${url}" target="_blank">${new URL(url).hostname}</a></div>
                    `
                }
                else {
                    fetchSiteData(url);
                    normalLink();
                }
            }
            else {
                normalLink();
            }
            
        }
        l.classList.add("link");
        l.setAttribute("target","_blank");
    })
    let youtubelinks = tag.querySelectorAll('a[href*="youtube.com"]');

    function runLater(func){
        return `<script>(${func.toString()})()</script>`;
    }

    for (let e of youtubelinks){
        let href = e.getAttribute("href");
        let id = (new URL(href)).searchParams.get("v");
        let d = document.createElement("div");
        e.parentNode.replaceChild(d, e);
        d.classList.add("youtubeEmbed");
        d.setAttribute("data-id",id);

        let title = "";

        
        if (getSiteDataSync(href)?.og?.title){
            let d = getSiteDataSync(href);
            title = `<div class="title"><a href="${href}" target="_blank">${d.og.title}</a></div>`;
        }
        fetchSiteData(href);

        d.innerHTML = `
            <div class="player">
                <canvas width="16" height="9" class="ratio"></canvas>
                <div style="background-image: url(${`https://i.ytimg.com/vi/${id}/hqdefault.jpg`})" data-id="${id}" class="thumbnail" onclick="addEmbedPlayer('${id}')">
                    <div class="play">
                    </div>
                </div>
                <span>[YouTube]</span>
            </div>
            ${title}
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

export function parseHTML(html){
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(html, 'text/html');
    return htmlDoc;
}

import storage from './storage';

var processedSiteDataMap = new Map();
export function getSiteDataSync(url){
    let id = "data/pagehtml/"+url;
    if (storage.getItem(id)){
        return processSiteData(storage.getItem(id));
    }
    return null;
}
window.getSiteDataSync = getSiteDataSync;
export function processSiteData(body){
    if (!processedSiteDataMap.has(body)){
        try {
            let dom = parseHTML(body);
            let og_raw = [...dom.querySelectorAll(`meta[property^=og]`)].map(e=>({
                prop:e.getAttribute("property"),
                value:e.content
            }));
            let og = {};
            for(let e of og_raw){
                let dots = e.prop.split(":");
                dots.shift();
                og[dots.join(":")] = e.value;
            }
            processedSiteDataMap.set(body,{
                title:dom.querySelector("title")?.innerText,
                desc:dom.querySelector("meta[name=description]")?.content,
                themeColor:dom.querySelector("meta[name=theme-color]")?.content,
                og_raw,
                og
            });
        } catch (err){
            return null;
        }
    }
    
    return processedSiteDataMap.get(body) || null;
}
let fetchingSiteData = [];
export function getSiteData(url){
    return new Promise(function(resolve,reject){
        function afterPage(body){
            try {
                resolve(processSiteData(body));
            } catch (err){
                console.error("Could not parse og",err);
                resolve(null);
            }
        }
        
        let id = "data/pagehtml/"+url;
        if (storage.getItem(id)){
            afterPage(storage.getItem(id));
            
            return;
        }
        else if (fetchingSiteData.includes(url)){
            
            resolve(null);
            return;
        }
        fetchingSiteData.push(url);
        
        httpRequest({
            url:url,
            headers:{
                "User-Agent":`Mozilla/5.0 (compatible; Google-Structured-Data-Testing-Tool +https://search.google.com/structured-data/testing-tool)`
            }
        }).then((res)=>{
            if (res.statusCode == 200){
                let body = res.body.split("</head>")[0]+"</head></html>";
                let meta_tags = body.match(/<meta.+>|<title.+>/g);
                let head = "<head>";
                head += meta_tags.join("");
                head += "</head>";
                body = head;
                
                storage.setItem(id,body);
                afterPage(body);
            } else {
                resolve(null);
            }
            
        }).catch(()=>{
            resolve(null);
        })
    })

}
window.getSiteData = getSiteData;