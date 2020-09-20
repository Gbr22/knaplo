

require("./proxy");


const express = require('express');
var proxy = require('express-http-proxy');
const app = express();
const port = 3000;

app.use(express.static('frontend/dist/'))
app.use('/proxy', proxy('localhost:1337'));

app.listen(port, () => {
  console.log(`Webserver listening at http://localhost:${port}`)
})

