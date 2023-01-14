const BigNumber = require ('bignumber.js')
const express = require ('express');
const app = express();
const fetch = require ('node-fetch')
const { response } = require('express');
const port =  [insert port number here];

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
res.status(200).sendFile(__dirname + "/public/basket.html");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
app.timeout = 2000;
app.use(express.json());
