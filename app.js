//import the express module and other required modules

const BigNumber = require ('bignumber.js')
const express = require ('express');
const app = express();
const fetch = require ('node-fetch')
const { response } = require('express');
const env = require ('dotenv').config()
let Datastore = require('nedb')
let dBase = new Datastore('working_database.db')
dBase.loadDatabase();
let dBase2 = new Datastore('confimation_database.db')
dBase2.loadDatabase();
const port =  process.env.PORT || [port number here];

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use(express.static("[folder name containing static files here]"));

app.get("/", (req, res) => {
res.status(200).sendFile(__dirname + "/public/[html file here]");
});

app.listen(port, () => console.log(`Listening on port ${port}`));

app.timeout = 2000;

app.use(express.json());

const myKey = process.env.myKey
const piURL ='https://api.minepi.com/v2/payments';

app.post('/merchant', async (request, response) => {
let data = request.body;
// Add some data validation code to check type of data being recieved
dBase.insert(data)
dBase.find({ piId: request.body.piId}, function(err, docs) {
 
  let shopper = docs 
  let customer = shopper.filter(function (cust) {
  if ((Date.now() - cust.timeStamp)<3000  && (cust.Merchant == request.body.Merchant ))
  {return cust}
  });
   response.json(customer)
  })
 })

app.post('/payshed', (request, response) => {
const datax = request.body
// Add some data validation code to check type of data being recieved
let actualUser = request.body.piId
console.log(datax)
dBase.find({ piId: request.body.piId}, function(err, docs) {
let pwhUser = docs 
let payer = pwhUser.filter(function (user) {
  if ((Date.now() - user.timeStamp)<60000  && (user.piId == actualUser ))
{return user}
});
response.json(payer)
 })
}) 

// let dB = [];
app.post('/reference', async (request, response) =>{
// Add some data validation code to check type of data being recieved
const dataR = request.body
dBase2.insert(dataR)
console.log(dataR)

response.json(dataR)

app.get('/reference2', async (request, response) => {

  dBase2.find({ piId: dataR.piId}, function(err, docs) {
 
    let refObject = docs 
    
    let payerConfirmed = refObject.filter(function (confirmed) {
      if ((Date.now() - confirmed.timeStamp)<=60000)
    {return confirmed}
    });
    
    console.log("Yay", payerConfirmed)
     response.json(payerConfirmed)
    })
  })

});

//Approve Route 
    app.post('/approve', async (request, response) => {
        // Add some data validation code to check type of data being recieved
        const paymentId = request.body.paymentId.toString();
        
        const options1 = {
        method: 'POST',
        headers: {'Authorization': `Key ${myKey}`,
                  'Access-control-Allow-Origin': '*'
                 }
                         };
    
//send order status to merchant to create order along with paymentId from pi Server
       
    hitEndpoints(piURL, paymentId, options1, 'approve')
  
     })

 //Complete Route 
    app.post('/complete', async(request, response) => {
        const paymentId = request.body.paymentId.toString();
        const txidData = request.body.txid;
        console.log(txidData)
        const txid = {"txid" : txidData}
       
        const options2 = {
            method: 'POST',
            headers: {'Authorization': `Key ${myKey}`,
                      'Access-control-Allow-Origin': '*', 
                      'Content-Type': 'application/json'
                     },
            body: JSON.stringify(txid)  
                         };
                  
hitEndpoints(piURL, paymentId, options2, 'complete')
             })

//Cancel Route  
    app.post('/cancel', async(request, response) => {

        const paymentId = request.body.paymentId.toString();
        const options3 = {
        method: 'POST',
        headers: {'Authorisation': `Key ${myKey}`},
                  'Access-control-Allow-Origin': '*',
                  'Content-Type': 'application/json'
                         };
 
// send status to merchant to let them know payment was cancelled
     })

//Incomplete Route  
    app.post('/incomplete', async(request, response) => {
        const payment = request.body.payment;
        const paymentId = (payment.identifier).toString();
        const txidData = payment.transaction.txid;   
        console.log(paymentId)
        const txid = {"txid": txidData}
        
        const options = {
        method: 'POST',
        headers: {'Authorization': `Key ${myKey}`,
                  'Access-control-Allow-Origin': '*', 
                  'Content-Type': 'application/json'
                 },
        body: JSON.stringify(txid)  
                        };
//Send status to merchant to do something with incomplete payment such as reserve item or complete it and then arrange a refund 

    hitEndpoints(piURL, paymentId, options, 'complete') 
         })

        async function hitEndpoints (piURL, paymentId, options, action) {

           const fetchMe = await fetch(`${piURL}/${paymentId}/${action}`, options).then(async result => {
                try {
                 const piServerResponse = await result.json()
                 //const piServerData = piServerResponse.json()
                console.log(`${action} Response data:`, piServerResponse)
                 const data = {
                 status: piServerResponse
                             }                
                return data;
                } catch(error) {
                 console.log(`Error! Payment process failed when hitting ${action} end point!`)
                 console.error(error)
                                }    
                 response.json(data);
                 response.status(200);            
              })
          } 

 app.post('/me', async (request, response) => {
        const accessToken = (request.body.accessToken).toString();
        const meURL =`https://api.minepi.com/v2/me`;
        const options0 = {
        method: 'GET',
        headers: {'Authorization': `Bearer ${accessToken}`,
                 'Access-control-Allow-Origin': '*',
                  'Content-Type': 'application/json',
                 },
                          };
        const fetchMe = await fetch (meURL, options0).then(async result => {
              try {
              const meResponse = await result.json()
              //console.log(meResponse)
              const data = {
                    "username": meResponse.username
                           }   
        response.json(data);
        response.status(200); 
             }catch(error) {
        console.log(`Error! Failed to Fetch User Data!`)
        console.error(error)
                           } 
           });
        })
