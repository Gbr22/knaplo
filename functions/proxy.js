let fetch = require("node-fetch").default;

exports.handler = async function(event, context) {
    return new Promise((resolve)=>{
        
        let url = event.headers["x-proxy-url"];
        let headers = {};
        for (p in event.headers){
            let val = event.headers[p];
            if (p.indexOf("x-proxy-header-") != -1){
                let header = p.replace("x-proxy-header-","");
                if (header == "apikey") {
                    header = "apiKey";
                }
                headers[header] = val;
            }
        }
        let request = {
            
            method:event.httpMethod,
            headers:headers,
            body:event.body
        }
        /* console.log(url,request,event); */
        fetch(url,request).then(async resp=>{
            resolve({
                statusCode: resp.status,
                statusText: resp.statusText,
                headers:{...resp.headers},
                body: await resp.text(),
            });
        }).catch(err=>{
            resolve({
                statusCode:500,
                body:err,
            })
        })
        
        
    })
    
}