let api = require("./api.js");

const http = require("http");
const fs = require("fs");

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3001;

(async () => {
    fs.writeFileSync("institute.json",await api.institute());
})();

app.use(cookieParser());

app.all('/**',async (req, res) => {
    

    
    if (req.cookies["access_token"] && req.cookies["inst"] && req.cookies["refresh_token"]){
        
        
        
        let refresh = true;

        if (refresh){
            let result = await api.refresh(req.cookies["inst"],req.cookies["refresh_token"])
            
            if (result == "error"){
                let options = {expires: new Date(0)};
                res.cookie("access_token","", options);
                res.cookie("refresh_token","", options);    
                res.cookie("inst","", options);
                res.send();
                return;
            }

            let options = {maxAge: 1000*60*60*24*30*365};
            res.cookie("access_token",result.access_token, options);
            res.cookie("refresh_token",result.refresh_token, options);
        }

        
    }

    

    


    let url = req.url.split("?")[0];
    let searchString = unescape(req.url.split("?")[1]);



    let search = {};
    console.log(url,searchString);

    

    if (searchString != undefined){
        let _search = searchString.split("&");
        
        for (let elem of _search){
            let arr = elem.split("=");
            search[arr[0]] = arr[1];
        }
    }
    

    if (url == "/institute"){
        //res.end(await api.institute());
        //res.header("Content-Type","application/json");
        //let stream = fs.createReadStream("institute.json");
        res.sendFile(__dirname+"/institute.json");
        //stream.pipe(res);
    }
    else if (url == "/login"){
        
        
        let needs = {
            inst:"Intézményt",
            username:"Felhasználónevet",
            password:"Jelszót"
        };

        function loginError(message){
            console.log(message);

            res.cookie("loginerror",message, {maxAge: 10000});
            res.redirect("/");
            
            
        }


        for (let p in needs){
            if (search.username){
                search.username = search.username.toString().replace(/\+/g," ").trim()
            }
            

            if (search[p] == undefined
              || search[p] == ""
              || search[p] == "null"){

                loginError("Nem adott meg "+needs[p]);
                return;
            }
        }
        

        api.login(search.inst,search.username,search.password)
        .catch((error)=>{
            loginError(error);
        })
        .then( (result) => {
            console.log(result);
            if (result.error){
                console.log(result.error);
                loginError(result.error.error_description);
                return;
                console.log("failed login");
            } else {
                let options = {maxAge: 1000*60*60*24*30*365};
                res.cookie("access_token",result.access_token, options);
                res.cookie("refresh_token",result.refresh_token, options);
                res.cookie("inst",search.inst, options);
                res.cookie("time",Date.now(), options);
                res.redirect("/");

            }
        })
            
        
        
    }
    else if (url=="/data"){
        let school = req.cookies["inst"];
        let token = req.cookies["access_token"];

        api.getData(school,token).then((data)=>{
            res.send(data);
        }).catch((err)=>{
            res.status(500);
            res.send("error");
        })
        


    }
    else if (url == "/health"){
        let resp = {
            time:Date.now(),
            timeZoneOffset:(new Date()).getTimezoneOffset()
        };
        res.send(JSON.stringify(resp));
    }
    else {
        res.end();
    }
});

app.listen(port);

console.log("Server started");