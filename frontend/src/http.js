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
        var r = new RegExp('^(?:[a-z]+:)?//', 'i');
        let urlObj;
        if (r.test(options.url)){
            urlObj = new URL(options.url);
        } else {
            urlObj = new URL(origin+options.url);
        }
        if (urlObj.origin != window.location.origin && !window.cordova){
            options.url = "https://cors-anywhere.herokuapp.com/"+urlObj.toString();
        } else {
            options.url = urlObj.toString();
        }
        


        let bodyText = options.body;
        if (typeof bodyText == "object"){
            bodyText = JSON.stringify(bodyText);
            options.headers["Content-Type"]="application/json";
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
            for (let header in options.headers){
                xhr.setRequestHeader(header, options.headers[header]);
            }
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
            xhttp.send(bodyText);
        }
    })
}
window.httpRequest = httpRequest;