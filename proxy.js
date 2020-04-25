const http = require('http');
const net = require('net');
const { URL } = require('url');
const https = require('https');
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
        lowercaseHeaders[p.toLocaleLowerCase()] = headers[p];
        let prefix = "X-Proxy-Header-";
        if (p.indexOf(prefix) == 0){
            let key = p.replace(prefix,"");
            headers[key] = headers[p];
            proxyHeaders[key] = headers[p];
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
        path: url.pathname,
        method: pReq.method,
        headers:proxyHeaders,
    }
    let data = [];
    pReq.on('data', chunk => {
        data.push(chunk)
    })
    pReq.on('end', () => {
        const req = protocols[url.protocol].request(options, (res) => {
            pRes.statusCode = res.statusCode;
            pRes.statusMessage = res.statusMessage;
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