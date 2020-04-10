var assert = require('assert');

let creds = null;
if (process.env["LOGIN"]){
    creds = JSON.parse(process.env["LOGIN"]);
} else {
    creds = require("./login.json");
}

var assert = require('assert');
const chai = require("chai");
const chaiHttp = require("chai-http");

esm = require("esm")(module/*, options*/)

const { expect } = chai;
chai.use(chaiHttp);

let port = Math.floor(Math.random() * 10000)+4000;

let app = require("../index.js")(port);

/* let { formatURLsHTML } = esm('../frontend/src/util.js');
formatURLsHTML("teszt"); */

describe("/api/", function(){
    it("should repond to requests",function(done){
        chai.request(app)
        .get("/running")
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    })
    let userInfo = {};
    it("login",function(done){
        chai.request(app)
        .post("/login")
        .query(creds)
        .end((err,res) => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.all.keys("access_token","refresh_token","inst","password_encrypted","username");
            expect(res).to.have.cookie('loginInfo');
            userInfo = res.body;
            done();
        })
    })
    it("data",function(done){
        chai.request(app)
        .get("/data")
        .set("Cookie",`loginInfo=${escape(JSON.stringify(userInfo))}`)
        .end((err,res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.include.keys("StudentId","Name");
            done();
        })
    })
    after(function(){
        app.close();
    })
})
/* describe('api.js', function() {
    let api = require("../api.js");
    it("should be an object",function(){
        assert(typeof api == "object");
    })
    describe('login chain', function() {
        let loginRes = null;
        it("login() should resolve with an object containing credentials",async function(){
            let result = await api.login(creds.inst,creds.username,creds.password);
            assert(typeof result == "object");
            loginRes = result;
        });
        describe("refreshUser()",function(){
            it("should refresh credentials",function(){
                throw new Error(JSON.stringify(loginRes));
                return api.refreshUser(JSON.stringify(loginRes));
            })
        })
    });
}); */