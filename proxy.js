const fetch = require('node-fetch');
module.exports = (req,res)=>{
    
    
    let url = req.headers["x-proxy-url"];
    let redirect = req.headers["x-proxy-redirect"];
    let headers = {};
    for (p in req.headers){
        if (p.indexOf("x-proxy-header-") != -1){
            let h = p.replace("x-proxy-header-","")
            if (h == "apikey"){
                h = "apiKey";
            }
            headers[h] = req.headers[p];
        }
    }
    
    let options = {
        headers,
        method:req.method,
        redirect:redirect,
    }
    if (req.method == "POST"){
        options.body = req.body;
    }
    
    fetch(url,options).then(r=>{
        let status = r.status;
        if (status >= 300 && status < 400){
            status = 299;
        }
        let h = {};
        [...r.headers.keys()].forEach(key=>{
            if (key == "set-cookie"){
                h["x-proxy-header-"+key] = r.headers.get(key);
            } else {
                h[key] = r.headers.get(key);
            }
        });
        h["x-proxy-status"] = r.status;
        
        res.status(status);
        

        res.set(h);
        r.body.pipe(res);
    }).catch(err=>{
        res.status(500);
        res.send();
    })
}

