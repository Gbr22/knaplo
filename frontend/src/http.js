import { tryJSON } from './util';

export function httpRequest(options){
    return new Promise(function(resolve,reject){

        function resolveResponse(res){
            res.bodyJSON = tryJSON(res.body);
            resolve(res);
        }

        let origin = window.location.origin;
        
        function objToURL(o){
            let string = "";
            for (let p in o){
                if (string != ""){
                    string+="&";
                }
                string+=`${p}=${o[p]}`;
            }
            return string;
        }

        options = Object.assign({ // defaults
            method:"GET",
            search:{},
            headers:{},
            body: undefined,
            url: undefined,
        },options);

        let isCors = false;

        let type = "utf8";
        let bodyText = options.body;
        if (typeof bodyText == "object"){
            console.log("body is object", JSON.parse(JSON.stringify(options)));

            if (!options.headers["Content-Type"] || options.headers["Content-Type"]=="application/json"){
                options.headers["Content-Type"]="application/json";
                type = "json";
                bodyText = JSON.stringify(bodyText);
                console.log("content type json");
            } else {
                type = "urlencoded";
                options.headers["Content-Type"]="application/x-www-form-urlencoded";
                bodyText = objToURL(bodyText);
            }
        }
        

        var r = new RegExp('^(?:[a-z]+:)?//', 'i');
        let urlObj;
        if (r.test(options.url)){
            urlObj = new URL(options.url);
        } else {
            urlObj = new URL(origin+options.url);
        }
        if (urlObj.origin != window.location.origin && !window.cordova){
            isCors = true;
            for (let p in options.headers){
                let prefix = "X-Proxy-Header-";
                if (p.indexOf(prefix) != 0){
                    options.headers[prefix+p] = options.headers[p];
                    delete options.headers[p];
                }
            }
            options.headers["X-Proxy-URL"] = options.url;
            options.url = "/proxy";
        } else {
            options.url = urlObj.toString();
        }
        


    
        function processRawHeaders(string){
            var arr = string.trim().split(/[\r\n]+/);

            // Create a map of header names to values
            var headerMap = {};
            arr.forEach(function (line) {
                var parts = line.split(': ');
                var header = parts.shift();
                var value = parts.join(': ');
                headerMap[header] = value;
            });
            return headerMap;
        }

        if (window.cordova){
            cordova.plugin.http.setDataSerializer(type);
            function respond(response){
                                
                let res = {
                    statusCode:response.status,
                    statusText:"",
                    req:options,
                    body:response.data || response.error,
                    headers:response.headers,
                };
                console.log(type,response);
                resolveResponse(res);
            }
            cordova.plugin.http.sendRequest(options.url,{
                data:options.body,
                headers:options.headers,
                method:options.method.toLowerCase()
            },respond,respond);
        } else {
            fetch(options.url, {
                method:options.method,
                headers:options.headers,
                body:bodyText
            }).then(async r=>{
                let blob = await r.blob();
                let res = {
                    statusCode:r.status,
                    statusText:r.statusText,
                    req:options,
                    blob,
                    body:await blob.text(),
                    headers:{...r.headers},
                };
                resolveResponse(res);
            }).catch(reject);
        }
    })
}
window.httpRequest = httpRequest;