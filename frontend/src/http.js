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
            
            if (!options.headers["Content-Type"]){
                options.headers["Content-Type"]="application/json";
                type = "json";
                bodyText = JSON.stringify(bodyText);
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
            var xhttp = new XMLHttpRequest();
            
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    
                    let res = {
                        statusCode:this.status,
                        statusText:this.statusText,
                        req:options,
                        body:this.response,
                        headers:processRawHeaders(xhttp.getAllResponseHeaders()),
                    };
                    /* console.log(res); */
                    resolveResponse(res);
                }
            };
            xhttp.open(options.method, options.url, true);

            for (let header in options.headers){
                /* console.log(header, options.headers[header]); */
                xhttp.setRequestHeader(header, options.headers[header]);
            }
            xhttp.send(bodyText);
        }
    })
}
window.httpRequest = httpRequest;