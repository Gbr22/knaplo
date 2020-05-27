
const { URL } = require('url');

const { http, https } = require('follow-redirects');
// Create an HTTP tunneling proxy
const proxy = http.createServer((pReq, pRes) => {
    pRes.setHeader("Access-Control-Allow-Origin","*");
    pRes.setHeader("Access-Control-Allow-Headers","*");

    

    if (pReq.method == "OPTIONS"){
        pRes.statusCode = 200;
        pRes.end();
        return;
    }
    let headers = {};
    for (let i =0; i < pReq.rawHeaders.length; i++){
        if (i%2 == 0){
            headers[pReq.rawHeaders[i]] = pReq.rawHeaders[i+1];
        }
    }
    let lowercaseHeaders = {};
    let proxyHeaders = {};
    for (let p in headers){
        lowercaseHeaders[p.toLowerCase()] = headers[p];
        
    }
    
    for (let p in lowercaseHeaders){
        let prefix = "x-proxy-header-";
        if (p.indexOf(prefix) == 0){
            let key = p.replace(prefix,"");
            if (key == "apikey"){
                key = "apiKey";
            }
            lowercaseHeaders[key] = lowercaseHeaders[p];
            proxyHeaders[key] = lowercaseHeaders[p];
            delete headers[p];
        }
    }
    /* console.log(headers); */
    
    /* console.log("X-Proxy-URL",headers["X-Proxy-URL"]); */
    let url;
    try {
        url = new URL(lowercaseHeaders["x-proxy-url"]);
    } catch(err){
        console.error(err);
        pRes.statusCode = 500;
        pRes.statusMessage = err.message;
        pRes.end();
        return;
    }
    /* console.log(url); */
    let protocols = {
        "http:":http,
        "https:":https
    }

    const options = {
        hostname: url.hostname,
        port: url.protocol == "http:" ? 80 : 443,
        path: url.pathname+url.search,
        method: pReq.method,
        headers:proxyHeaders,
    }
    let data = [];
    
    pReq.on('data', chunk => {
        data.push(chunk)
    })
    pReq.on('end', () => {
        const req = protocols[url.protocol].request(options, (res) => {
            
            pRes.writeHead(res.statusCode, res.statusMessage,res.headers);
            res.pipe(pRes);
        })
        req.on('error', (error) => {
            console.error(error);
            pRes.statusCode = 500;
            pRes.statusMessage = error.message;
            pRes.end();
        });
        
        data.forEach(c=>{
            /* console.log("send chunk",c.toString()); */
            req.write(c);
        })
        
        req.end();
    })
    
});
// Now that proxy is running
let port = 1337;
proxy.listen(port, '127.0.0.1', () => {
    console.log("Proxy started on",port);
});