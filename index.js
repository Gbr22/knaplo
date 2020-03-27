let api = require("./api.js");

const http = require("http");
const fs = require("fs");

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;

const crypto = require('crypto');

function getLastCommit(){
    function run(command){
        return require('child_process').execSync(command).toString().trim()
    }
    
    return {
        hash:run("git rev-parse HEAD"),
        time:run(`git log -1 --format="%at"`),
    };
}
let lastcommit = getLastCommit();
console.log("Running "+lastcommit.hash);

app.use(cookieParser());


let enc_dec_secret;
if (!fs.existsSync("secret")){
    var token = crypto.randomBytes(64).toString('hex');
    fs.writeFileSync("secret",token);

    enc_dec_secret = token;
} else {
    enc_dec_secret = fs.readFileSync("secret");
}


function encrypt(data){
    let secret = enc_dec_secret;
    var key = crypto.createCipher('aes-128-cbc', secret);
    var str = key.update(data, 'utf8', 'hex')
    str += key.final('hex');
    return str;
}
function decrypt(data){
    let secret = enc_dec_secret;

    try {
        var key = crypto.createDecipher('aes-128-cbc', secret);
        var str = key.update(data, 'hex', 'utf8')
        str += key.final('utf8');
        return str;
    } catch(err){
        throw err;
    }
}
{// encryption decryption test
    let start = Date.now();
    let original = "test";
    console.log("Original string: ",{s:original});
    let enc = encrypt(original);
    console.log("Encrypted string: ",{s:enc});
    let dec = decrypt(enc);
    console.log("Decrypted string: ",{s:dec});
    console.log("Matches original: ",original == dec);
    console.log("Took: ",Date.now()- start);
}

app.all('/login',async (req, res) => {
     
    let needs = {
        inst:"Intézményt",
        username:"Felhasználónevet",
        password:"Jelszót"
    };

    function loginError(message){
        console.log(message);

        res.statusCode = "500";
        res.send(message);

    }


    for (let p in needs){
        if (req.query.username){
            req.query.username = req.query.username.toString().replace(/\+/g," ").trim()
        }
        

        if (req.query[p] == undefined
          || req.query[p] == ""
          || req.query[p] == null){

            loginError("Nem adott meg "+needs[p]);
            return;
        }
    }
    

    api.login(req.query.inst,req.query.username,req.query.password)
    .catch((error)=>{
        loginError(error);
    })
    .then( (result) => {
        console.log(result);
        if (result.error){
            console.log(result.error);
            loginError(result.error.error_description);
            return;
        } else {
            let options = {maxAge: 1000*60*60*24*30*365};
            let info = {
                "access_token":result.access_token,
                "refresh_token":result.refresh_token,
                "inst":req.query.inst,
                "password_encrypted":encrypt(req.query.password),
                "username":req.query.username
            }
            res.cookie("loginInfo",JSON.stringify(info), options);
            
            res.send(info);

        }
    })
});
function refresh(login){
    return new Promise(async function(resolve,reject){

        console.log("login",login);
        let result = await api.refresh(login.inst,login.refresh_token);
        console.log("result for ",login.inst, login.refresh_token, result);

        if (result == "error"){
            //console.log("Refresh token failed, trying password");


            let _return = false;
            //try logging in again
            let password;
            try {
                password = decrypt(login.password_encrypted);
            } catch(err){
                //console.log("Failed to decrypt password",err);
                resolve(false);
                return;
            }
            console.log("decrypted password");
            
            api.login(login.inst,login.username,password)
            .catch((error)=>{
                resolve(false);
            })
            .then( (result) => {
                console.log("Password auth successful");

                login.access_token = result.access_token;
                login.refresh_token = result.refresh_token;
                

                resolve(true);
            });

            
            
            
        } else {
            console.log("Token auth successfull");

            login.access_token = result.access_token;
            login.refresh_token = result.refresh_token;

            resolve(true);
        }

        

    });
}
app.all('/inst_full',async (req, res) => {
    res.sendFile(__dirname+"/institute.json");
});
app.all('/institute',async (req, res) => {
    res.sendFile(__dirname+"/inst_clean.json");
});
app.all('/**',async (req, res, next) => {
    let login = null;
    function tryRefresh(){
        return new Promise(function(resolve,reject){
            try {
                login = JSON.parse(req.cookies["loginInfo"]);
            } catch(err){
                reject();
            }
            


            if (login){
                console.log("Refreshing auth");
        
                refresh(login).then((ref)=>{
                    console.log("refresh:",ref);
                    if (ref == true){
                        resolve();
                    } else {
                        reject();
                    }
                }).catch(()=>{
                    reject();
                })
            } else {
                reject();
            }
        });
    }
    function badLogin(){
        res.statusCode = 500;
        res.send("Érvénytelen bejelentkezés");
    }

    tryRefresh().then((success)=>{
        req.login = login;
        res.cookie("loginInfo",JSON.stringify(login));
        next();
    }).catch((err)=>{
        console.log(err);
        badLogin();
    })
});
app.all('/health',async (req, res) => {
    let resp = {
        time:Date.now(),
        timeZoneOffset:(new Date()).getTimezoneOffset()
    };
    res.send(JSON.stringify(resp));
});


/* app.all('/data',async (req, res) => {
    let school = req.cookies["inst"];
    let token = req.cookies["access_token"];

    api.pipeData(school,token,res);
}); */
app.all('/data',async (req, res) => {
    let school = req.login.inst;
    let token = req.login.access_token;

    api.studentAmi(school, token).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send(err.message);
    })
    
    /* api.getData(school,token).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.status(500);
        res.send("error");
    }) */
});
app.all('/lastcommit',async (req, res) => {
    res.send(JSON.stringify(lastcommit));
});

app.listen(port);

console.log("Server started");