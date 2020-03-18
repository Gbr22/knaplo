let webapi = require("./webapi.js");

(async ()=>{
    let school = "eszi";
    webapi.login(school,"72352811694", "waffleasd123").then((login)=>{
        let user = login.user;
        console.log(login.body.ErrorMessage,user);
        webapi.chain([
            ["get","Adminisztracio/SzerepkorValaszto","",(html)=>{
                user.token = html.body.split(`name="__RequestVerificationToken"`)[1]
                    .split('value="')[1].split('"')[0];
            }],
            /* ["get","Intezmeny/Faliujsag"], */
            ["post","Home/EUgyUzenetekRecheck","",(eugy)=>{
                user.cookies["FrissitesiDatum"] = Date.now(); console.log("frissites")
            }],
            ["post","Home/GetIsFrissitesWarrning"],
            ["post","Layout/GetLayoutInformation","",(layout)=>{console.log("logged in as",layout)}],
            /* ["get","Intezmeny/Faliujsag/GetMoreEntries?startindex=0&range=10&_="+(Date.now()-1000)], */
            
        ],user);
        /* webapi.auth(user).then((auth)=>{
            console.log("auth",auth.body.indexOf("commitNumber") != -1,user.cookies);
            webapi.getTime(user).then((time)=>{
                console.log(time);
                
                webapi.EugyRecheck(user).then((eugy)=>{
                    console.log(eugy);
                    console.log("board");
                });
            });
        }); */
    });
})();