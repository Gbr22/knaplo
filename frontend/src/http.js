export function httpRequest(options){
    return new Promise(function(resolve,reject){

        let origin = "http://localhost:84"
        

        options = Object.assign({ // defaults
            method:"GET",
            search:{},
            headers:{},
            body: undefined,
            url: undefined,
        },options);

        let isCors = false;

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
            options.url = "http://localhost:5050";
        } else {
            options.url = urlObj.toString();
        }
        


        let bodyText = options.body;
        if (typeof bodyText == "object"){
            bodyText = JSON.stringify(bodyText);
            if (!options.headers["Content-Type"]){
                options.headers["Content-Type"]="application/json";
            }
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
            
        } else {
            var xhttp = new XMLHttpRequest();
            
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    let res = {
                        status:this.status,
                        statusText:this.statusText,
                        req:options,
                        body:this.response,
                        headers:processRawHeaders(xhttp.getAllResponseHeaders()),
                    };
                    resolve(res);
                }
            };
            xhttp.open(options.method, options.url, true);

            for (let header in options.headers){
                xhttp.setRequestHeader(header, options.headers[header]);
            }

            xhttp.send(bodyText);
        }
    })
}
window.httpRequest = httpRequest;