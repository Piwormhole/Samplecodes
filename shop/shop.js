const BigNumber = require ('bignumber.js')
const express = require ('express');
const app = express();
const fetch = require ('node-fetch')
const { response } = require('express');
const env = require ('dotenv').config()
const port =  process.env.PORT || 8050;
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(express.static("public"));

app.get("/", (req, res) => {
res.status(200).sendFile(__dirname + "/public/shop.html");
});

app.listen(port, () => console.log(`Listening on port ${port}`));

app.timeout = 2000;

app.use(express.json());

const myKey = process.env.myKey
app.post('/store', async (request, response) => {
    let data = request.body;
  //do something with data such as store in shop's Database etc 
    
    //response.json(data)
     })