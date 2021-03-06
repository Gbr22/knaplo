



var args = process.argv.slice(2);

const express = require('express');
var proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(bodyParser.text());

app.use('/proxy', require("./proxy"));

if (args.includes("--dev")){
  console.log("Dev server");
  app.use('/', proxy('localhost:8080'));
} else {
  console.log("Prod server");
  app.use(express.static('frontend/dist/'))
}



app.listen(port, () => {
  console.log(`Webserver listening at http://localhost:${port}`)
})

