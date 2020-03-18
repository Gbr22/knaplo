let request = require('request-promise-native');
var needle = require('needle');

let users = {

}

function addCookies(user,cookies){
    users[user.username].cookies = Object.assign(users[user.username].cookies,cookies);
}

function login(school, username, password){
    return new Promise(function(resolve,reject){
        let url = `https://${school}.e-kreta.hu/Adminisztracio/Login/LoginCheck`;
        let json = {
            UserName:username,
            Password:password
        }
        needle('put',url, json,
            {
                json:true
            }
        ).then((res)=>{
            if (res.body.Success){
                users[username] = {
                    school:school,
                    cookies:res.cookies,
                    username
                }
            }
            resolve({
                body:res.body,
                user:users[username]
            })
        });
    });
    
}
function req(method,path,user,data = "",callback = ()=>{}){
    return new Promise(function(resolve,reject){
        let url = `https://${user.school}.e-kreta.hu/${path}`;
        
        let headers = {
            "content-type":"application/json; charset=utf-8",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        }

        if (user.token){
            headers["X-Request-Verification-Token"] = user.token;
        }
        /* if (user.cookies["__RequestVerificationToken"]){
            headers["X-Request-Verification-Token"] = user.cookies["__RequestVerificationToken"];
        } */
        
        needle(method,url, data,
            {
                cookies:user.cookies,
                json:true,
                follow_max: 5,
                headers:headers
            }
        ).then((res)=>{
            addCookies(user,res.cookies);
            
            let out = {
                body:res.body,
                code:res.statusCode
            };
            callback(out);
            resolve(out);
        }).catch(reject);
    });
}
async function chain(requests,user){
    for(let i=0; i < requests.length; i++){
        let r = requests[i];
        let result = await req(r[0],r[1],user,r[2],r[3]);

        
        if (i == requests.length-1){
            console.log(r[1],result);
        }

        
    }
    
}

function auth(user){
    return req("get","Adminisztracio/SzerepkorValaszto", user);
}
function getTime(user){
    return req("get","Layout/GetRemainingTime", user);
}
function EugyRecheck(user){
    return req("post","Home/EUgyUzenetekRecheck", user);
}



module.exports = {
    login,
    auth,
    getTime,
    EugyRecheck,
    chain
}