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
//dBase.insert({information : "Test Data"})

// dBase.insert({information : "Test Data2"})
const port =  process.env.PORT || 8020;

// Add Access Control Allow Origin headers
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
// res.status(200).sendFile(__dirname + "/public/dummy-store.html");
res.status(200).sendFile(__dirname + "/public/app new.html");
});

//Next specidfy the listening port  
app.listen(port, () => console.log(`Listening on port ${port}`));

app.timeout = 2000;

//Next you need to host your client static files (web page) on express.
//app.use(express.static('public')); 

//Next let the server know to read JSON files
app.use(express.json());

const myKey = process.env.myKey
const piURL ='https://api.minepi.com/v2/payments';

// Merchant data Route
app.post('/merchant', async (request, response) => {
let data = request.body;
dBase.insert(data)
// console.log(data)
dBase.find({ piId: request.body.piId}, function(err, docs) {
 
  let shopper = docs 
  
  let customer = shopper.filter(function (cust) {
  if ((Date.now() - cust.timeStamp)<3000  && (cust.Merchant == request.body.Merchant ))
  
  {return cust}
  });
  
  // console.log(customer)
   response.json(customer)
  })

//response.json(data)
 })

app.post('/payshed', (request, response) => {
const datax = request.body
let actualUser = request.body.piId
console.log(datax)
dBase.find({ piId: request.body.piId}, function(err, docs) {
 
let pwhUser = docs 

let payer = pwhUser.filter(function (user) {
  if ((Date.now() - user.timeStamp)<60000  && (user.piId == actualUser ))
{return user}
});

// console.log(payer)
 response.json(payer)
 
  //console.log(docs)
} )
//response.json(datax);
   }) 

// let dB = [];
app.post('/reference', async (request, response) =>{

const dataR = request.body
dBase2.insert(dataR)
console.log(dataR)

response.json(dataR)
// }

// if(refNumber && refNumber != "logged out" && piId) {
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
// }
// else if (refNumber == "logged out"){
//     app.get('/reference2', async (request, response) => {
      
//        })   
// }
 
});

//Approve Route 
    app.post('/approve', async (request, response) => {
        const paymentId = request.body.paymentId.toString();
        
        const options1 = {
        method: 'POST',
        headers: {'Authorization': `Key ${myKey}`,
                  'Access-control-Allow-Origin': '*'
                 }
                         };
    
//Next, create an order along with paymentId from pi Server
//await HTMLAllCollection.insertOne({pi_paymentid: paymentId}); 
        
// Next hit the approve end point to approve the payment
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
//do something with incomplete payment such as reserve his item or complete it and then arrange a refund 
                  
//Next hit the complete end point to complete the payment
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
 
// Next hit the complete end point to complete the payment
   // hitEndpoints(piURL, paymentId, options3, 'cancel')  
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
//do something with incomplete payment such as reserve his item 
              
//Next hit the complete end point to complete the payment
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