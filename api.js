//imports
const _request = require('request-promise-native');

const needle = require("needle");

const fs = require('fs');

//consts
const api_key = "7856d350-1fda-45f5-822d-e1a2f3f1acf0";
const api_base = "https://kretaglobalmobileapi.ekreta.hu"
const client_id = "919e0c1c-76a2-4646-a2fb-7085bbbf3c56";
const api_full = api_base+"/api/v1/";
const userAgent = "Kreta.Ellenorzo/2.9.11.2020033003 (Linux; U; Android 8.0.0)";

const defaultOptions = {
    method: "GET",
    headers: {
        "apiKey":api_key,
        "charset":"utf-8",
        "User-Agent":userAgent
    },
    json:true
}

const crypto = require('crypto');

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

function req(options){
    let obj = Object.assign({},defaultOptions);
    return _request(Object.assign(obj,options));
}


async function institute(){
    return await (req({
        url:'https://kretaglobalmobileapi2.ekreta.hu/api/v2/Institute',
        json:false
    }));
}


(async () => {
    let inst = await institute();
    fs.writeFileSync("institute.json",inst);
    let arr = JSON.parse(inst);
    inst = undefined;
    let clean = [];
    for (let i=0; i < arr.length; i++){
        let e = arr[i];
        clean.push({
            Name:e.name,
            InstituteCode:e.instituteCode,
            City:e.city,
        });
    }
    fs.writeFileSync("inst_clean.json",JSON.stringify(clean));
})();

function login(school,username,password){
    return new Promise(function(resolve,reject){
        let data = {
            institute_code:school,
            userName:username,
            password:password,
            grant_type:'password',
            client_id:client_id,
        }
        let options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent":userAgent,
            }
        }
        needle('post',`https://${school}.e-kreta.hu/idp/api/v1/Token`, data, options).then((res)=>{
            if (res.statusCode == 200){
                resolve(res.body);
            } else {
                reject(new Error(`login ${res.statusCode} ${res.statusMessage}`));
            }
        }).catch((err)=>{
            reject(err);
        })
    });
    
}
function refresh(user){
    return new Promise(function(resolve,reject){
        let data = {
            refresh_token:user.refresh_token,
            grant_type:'refresh_token',
            client_id:client_id,
        }
        let options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent":userAgent,
            }
        }
        needle('post',`https://${user.inst}.e-kreta.hu/idp/api/v1/Token`, data, options).then((res)=>{
            if (res.statusCode == 200){
                resolve(res.body);
            } else {
                reject(new Error(`refresh ${res.statusCode} ${res.statusMessage}`));
            }
        }).catch((err)=>{
            reject(err);
        })
    });
}
function refreshUser(loginInfoS){
    return new Promise(function(resolve,reject){
        let loginInfo = null;
        try {
            loginInfo = JSON.parse(loginInfoS);
        } catch(err){
            reject(new Error("invalid cookie"));
        }
        refresh(loginInfo).then((result)=>{
            loginInfo.access_token = result.access_token;
            loginInfo.refresh_token = result.refresh_token;
            resolve(loginInfo);
            console.log("[token auth]")
        }).catch(()=>{
            let password;
            try {
                password = decrypt(loginInfo.password_encrypted);
            } catch(err){
                reject(new Error("password broken"));
            }
            
            login(loginInfo.inst,loginInfo.username,password).then((result)=>{
                loginInfo.access_token = result.access_token;
                loginInfo.refresh_token = result.refresh_token;
                resolve(loginInfo);
                console.log("[password auth]")
            }).catch(()=>{
                reject(new Error("failed login"));
            })
        })

    });

}
function validateUser(loginInfoS){
    return new Promise(function(resolve,reject){
        let loginInfo = null;
        try {
            loginInfo = JSON.parse(loginInfoS);
        } catch(err){
            reject(new Error("invalid cookie"));
        }
        let tokenInfo = decodeToken(loginInfo.access_token);
        let expires = tokenInfo.exp;
        let now = Date.now()/1000;
        let time = expires - now; //in seconds
        let timeMinutes = time/60;
        if (timeMinutes >= 3){
            console.log(`[${timeMinutes.toFixed(2)}m left till refresh]`);
            resolve(loginInfo);
        } else {
            refreshUser(loginInfoS).then(resolve).catch(reject);
        }
    })

}
function decodeToken(access_token){
    let parts = access_token.split(".");
    function decode(data){
        let buff = new Buffer(data, 'base64');
        let text = buff.toString('utf8');
        return text;
    }
    return JSON.parse(decode(parts[1]));
}
function pipeData(school,token,p){
    
    req({
        url:`https://${school}.e-kreta.hu/mapi/api/v1/Student?fromDate=null&toDate=null`,
        headers:{
            "Authorization":"Bearer "+token,
        },
        json:false
    }).pipe(p);
    
}
function getData(school,token){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/mapi/api/v1/Student?fromDate=null&toDate=null`,
            headers:{
                "Authorization":"Bearer "+token,
                "User-Agent":userAgent
            },
            json:false
        }).then((json)=>{
            resolve(json);
        }).catch((json)=>{
            reject(json);
            //resolve(json);
        });
    });
    
}
function studentAmi(school,token){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/mapi/api/v1/StudentAmi`,
            headers:{
                "Authorization":"Bearer "+token,
                "User-Agent":userAgent
            },
            json:false
        }).then((json)=>{
            resolve(json);
        }).catch((json)=>{
            reject(json);
            //resolve(json);
        });
    });
}
function timeTable(school,token){
    let url = `https://${school}.e-kreta.hu/mapi/api/v1/LessonAmi?fromDate=null&toDate=null`;
    return new Promise(function(resolve,reject){
        let options = {
            headers: {
                "Authorization":"Bearer "+token,
                "User-Agent":userAgent,
            }
        }
        needle('get',url, options).then((res)=>{
            resolve(res.body);
        }).catch((err)=>{
            reject(err);
        })
    });
}
function homework(school,token, id){
    let url = `https://${school}.e-kreta.hu/mapi/api/v1/HaziFeladat/TanarHaziFeladat/${id}`;
    return new Promise(function(resolve,reject){
        let filename = `cache/homework/${school}.${id}.cache`;

        if (fs.existsSync(filename)){
            console.log(`serving hw ${id} from cache`);
            resolve(JSON.parse(fs.readFileSync(filename).toString()));
            return;
        }

        let options = {
            headers: {
                "Authorization":"Bearer "+token,
                "User-Agent":userAgent,
            }
        }
        needle('get',url, options).then((res)=>{
            if (res.body && res.statusCode === 200){
                fs.writeFileSync(filename,JSON.stringify(res.body));
            }
            resolve(res.body);
        }).catch((err)=>{
            reject(err);
        })
    });
}
function save_HWC_changes(user,changelist){
    let filename = __dirname+`/db/homework/${user.username}.db`;
    let contents = {};
    if (fs.existsSync(filename)){
        try {
            contents = JSON.parse(fs.readFileSync(filename).toString());
        } catch(err){

        }
    }
    for (let e of changelist){
        let badObj = false;
        if (!contents[e.id]){
            badObj = true;
        } else if (Object.keys(contents[e.id]).length === 0){
            badObj = true;
        }
        if (badObj){
            contents[e.id] = {changed:-Infinity};
        }

        if (e.changed > contents[e.id].changed){
            contents[e.id] = {
                changed:e.changed,
                value:e.value
            }
        }
    }
    fs.writeFileSync(filename, JSON.stringify(contents));
    return contents;
}

module.exports = {
    key:api_key,
    base:api_base,
    full:api_full,
    institute,
    login,
    getData,
    pipeData,
    refresh,
    studentAmi,
    timeTable,
    homework,
    refreshUser,
    validateUser,
    encrypt,
    decrypt,
    save_HWC_changes
}