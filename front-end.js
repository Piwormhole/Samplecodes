function seekConfirmation(){
    const pmtConfirm = confirm("Are you sure you want to make this payment?")
    if(pmtConfirm) {
    {setTimeout(makePayment, 100)}
    }else {cancel()}
  }

  window.Pi.init({ version: "2.0", sandbox: true});
      
  const onIncompletePaymentFound = async function (payment) {

  let data = {
                  "payment":payment,
                  "action" : "incomplete"
             };
  const config = {
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
               },
      body: JSON.stringify(data)  
                 };
const incompRes = await fetch('/incomplete', config); //.then(response //this works both ways...sends data to server=> 
const incompResData = await incompRes.json()
                      };
async function auth (){

const scopes = ["username", "payments"];
window.Pi.authenticate(scopes, onIncompletePaymentFound).then(async function(auth) {
     
   let userName = auth.user.username
   let uniqueId = auth.user.uid
   let accessToken = auth.accessToken
   let connecting = document.getElementById("connector")
    connecting.innerText = "Connecting...."
   let data0 = {
                  "accessToken": accessToken,
                  "action" : "verify user"
          };
   const config0 = {
     method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
               },
    body: JSON.stringify(data0)  
                 };
                 console.log(data0)
 const meRes = await fetch('/me', config0);
 const meResponseData = await meRes.json()
  if (meResponseData.username == userName) {
   connecting.innerText = "Connected as "+userName
   document.getElementById("actualPiId").innerText = userName
   localStorage.setItem("actualPiId", userName)
   document.getElementById("retriever").style.display = "flex"
   document.getElementById("logout").style.display = "block"
   document.getElementById("Logged Out").style.display = "none" 
   console.log(`Hello ${userName}`);
   console.log(document.getElementById("actualPiId").innerText)
  
             } else {
   document.getElementById("User Name").textContent ="Mismatching User Names";
   console.log(`User Name Mismatch`);

             }
    }).catch(function(error) {
   console.error(error);
});    
} 

async function retrieveMerchantData() {
let actualPiId = document.getElementById("actualPiId").innerText
let payData = {
                  "piId": actualPiId,
                  "timeStamp" : Date.now(),
          };
   const config01 = {
     method: 'POST',
      headers: {
                'Content-Type': 'application/json'
                // 'Access-Control-Allow-Origin': '*'
               },
    body: JSON.stringify(payData)  
                 };
// console.log(data0)
 const payShed = await fetch('/payshed', config01);
 const payShedResponse = await payShed.json()
//  console.log(payShedResponse[0].piId)

// if((actualPiId != payShedResponse[0].piId) || !payShedResponse){
  if(!payShedResponse[0]){
  document.getElementById("Wrong User").style = "costItem2" 
  document.getElementById("retriever").disabled = true
  document.getElementById("logout").disabled = true

   }
else {
let retrieving = document.getElementById("retriever")
retrieving.innerText = "Retrieving Payment...."
localStorage.removeItem("cancelled")
localStorage.removeItem("trxid")
document.getElementById("merchantp").style = "costItem"
document.getElementById("cost").style = "costItem"
document.getElementById("pwhfees").style = "costItem"
document.getElementById("sum").style = "costItem"
// document.getElementById("PaymentAmnt").innerHTML = parseInt(localStorage.getItem("Price")) + " Pi"
document.getElementById("PaymentAmnt").innerText= parseInt(payShedResponse[0].finalPrice) + " Pi"
document.getElementById("PaymentAmnt2").innerText= parseInt(payShedResponse[0].finalPrice)
document.getElementById("dBid").innerText= payShedResponse[0]._id


let payAmnt2 = parseInt(payShedResponse[0].finalPrice);
console.log(payAmnt2)
let fee;
let totalToPay; 
if (payAmnt2 && payAmnt2 <= 1000) {
                      fee =(0.0025 * payAmnt2).toFixed(3)
                      totalToPay = parseFloat(payAmnt2) + parseFloat(fee)
                   } else if (payAmnt2 && payAmnt2 > 1000 ){fee = 1; totalToPay = parseFloat(payAmnt2) + parseFloat(fee)}
  document.getElementById("Fees").innerText = fee + " Pi"
    document.getElementById("Total").innerText = totalToPay + " Pi"
    if (totalToPay && fee && payAmnt2){
  document.getElementById("pay").disabled = false;
}

// document.getElementById("Merchant Name").innerHTML = localStorage.getItem("Merchant")
document.getElementById("Merchant Name").innerText = payShedResponse[0].Merchant
document.getElementById("Merchant Name").style = "price"
document.getElementById("PaymentAmnt").style = "price"
document.getElementById("Fees").style = "price"
document.getElementById("Total").style = "price"
retrieving.style.display = "none"
document.getElementById("pay").style.display = "block"
document.getElementById("cancel").style.display= "block" 
//  localStorage.removeItem("Price")
//  localStorage.removeItem("Merchant")
}
} 

function cancel(){
//add alert to get confirmation of cacellation)
document.getElementById("merchantp").style.display = "none"
document.getElementById("cost").style.display = "none"
document.getElementById("pwhfees").style.display = "none"
document.getElementById("sum").style.display = "none"
document.getElementById("PaymentAmnt").style.display = "none"
document.getElementById("retriever").style.display = "none"
document.getElementById("Merchant Name").style.display = "none"
document.getElementById("Fees").style.display = "none"
document.getElementById("Total").style.display = "none"

document.getElementById("pay").style.display = "none"
document.getElementById("cancel").style.display = "none"   
document.getElementById("Cancelled2").style = "costItem2" 
// localStorage.removeItem("Price")
// // localStorage.removeItem("Merchant")
localStorage.removeItem("trxid")
// localStorage.removeItem("cancelled")
}

const callbacks = {

onReadyForServerApproval: async function (paymentId) {

let data1 = {
                  "paymentId": paymentId,
                  "action" : "approve"
          };

console.log(`Payment ${paymentId} is ReadyForServerApproval`);
  const config1 = {
     method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
               },
    body: JSON.stringify(data1)  
                 };
const response = await fetch('/approve', config1);
const reponseData = await response.json()
},

onReadyForServerCompletion : async function (paymentId, txid) {

let data2 = {
                   "paymentId": paymentId,
                   "txid": txid,
                   "action" : "complete"
           };
console.log(txid)
localStorage.setItem("trxid", txid)
const config2 = {
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
               },
      body: JSON.stringify(data2)  
                 };
const completeRes = await fetch('/complete', config2)
const completeresData = await completeRes.json()

},

onCancel: async function (paymentId) {
let data3 = {
                   "paymentId": paymentId,
           };
console.log(`"Payment Cancelled "${paymentId}`);
localStorage.setItem("cancelled", paymentId)

const config3 = {
      method: 'POST',
       headers: {
                 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*'
                },
       body: JSON.stringify(data3)  
               };
const response = await fetch('/cancel', config3);
},

onError : (error, payment) => {
console.log("onError", error);

if(payment) {
      console.log("payment")
  }
},

};

//Payment Function
async function makePayment() {   
//add alert to get confirmation of payment)
let payAmntA = document.getElementById("Total").innerHTML; 
let payAmnt = parseFloat(document.getElementById("Total").innerHTML)

const paymentData = {amount: payAmnt, 
                   memo: "Testing Pi Gateway", 
                   metadata: {prototype: "Tester 1"}
                   }; 
Pi.createPayment( paymentData, callbacks);


function paymentSuccessLoader() {

let crossCheck = localStorage.getItem("trxid");
if (!crossCheck)
  {           document.getElementById("Success").style.display = "none"
              document.getElementById("Cancelled").style = "costItem2"
              document.getElementById("Complete Data").style.display = "none"
              document.getElementById("TRXID").style.display = "none"
              document.getElementById("merchantp").style.display = "none"
              document.getElementById("cost").style.display = "none"
              document.getElementById("pwhfees").style.display = "none"
              document.getElementById("sum").style.display = "none"
              document.getElementById("Merchant Name").style.display = "none"
              document.getElementById("Fees").style.display = "none"
              document.getElementById("Total").style.display = "none"
              document.getElementById("PaymentAmnt").style.display = "none"
              document.getElementById("pay").style.display = "none"
              document.getElementById("cancel").style.display = "none"  
       
              console.log("No TXID yet ") 
              let cancelTrx = localStorage.getItem("cancelled")
              // console.log(cancelTrx + "DUDE")
              if(cancelTrx) { 
              document.getElementById("Success").style.display = "none"
              document.getElementById("Cancelled").style = "costItem2"
              document.getElementById("Complete Data").style.display = "none"
              document.getElementById("TRXID").style.display = "none"
              document.getElementById("merchantp").style.display = "none"
              document.getElementById("cost").style.display = "none"
              document.getElementById("pwhfees").style.display = "none"
              document.getElementById("sum").style.display = "none"
              document.getElementById("Merchant Name").style.display = "none"
              document.getElementById("Fees").style.display = "none"
              document.getElementById("Total").style.display = "none"
              document.getElementById("PaymentAmnt").style.display = "none"
              document.getElementById("pay").style.display = "none"
              document.getElementById("cancel").style.display = "none"  
              clearInterval(timer)
              console.log("loop ended")
              }
    } else if (crossCheck) 
                       {
              document.getElementById("Complete Data").style = "costItem"
              document.getElementById("Success").style = "costItem"
              document.getElementById("Cancelled").style.display = "none"
              console.log("Gotcha ", + localStorage.getItem("trxid"))
              document.getElementById("TRXID").innerHTML =" " + localStorage.getItem("trxid");
              document.getElementById("TRXID").style.display = "flex"
              document.getElementById("PaymentAmnt").style.display = "none"
              document.getElementById("retriever").style.display = "none"
              document.getElementById("Merchant Name").style.display = "none"
              document.getElementById("Fees").style.display = "none"
              document.getElementById("Total").style.display = "none"
              document.getElementById("pay").style.display = "none"
              document.getElementById("cancel").style.display = "none"  
              clearInterval(timer)
              console.log("loop ended")
                      }
}

let timer = setInterval(paymentSuccessLoader, 6000);

};

function logOut(){
document.getElementById("Wrong User").style.display = "none" 
document.getElementById("Complete Data").style.display = "none"
document.getElementById("Success").style.display = "none"
let connecting = document.getElementById("connector")
connecting.innerText = "Login to make payment" // consider blacking this out or removing and adding a "Close Page Button"
let retrieving = document.getElementById("retriever")
retrieving.innerText = "View Payment"
document.getElementById("logout").style.display = "none"
document.getElementById("retriever").style.display = "none"
document.getElementById("merchantp").style.display = "none"
document.getElementById("cost").style.display = "none"
document.getElementById("pwhfees").style.display = "none"
document.getElementById("sum").style.display = "none"
document.getElementById("PaymentAmnt").style.display = "none"
document.getElementById("retriever").style.display = "none"
document.getElementById("Merchant Name").style.display = "none"
document.getElementById("Fees").style.display = "none"
document.getElementById("Total").style.display = "none"
document.getElementById("pay").style.display = "none"
document.getElementById("cancel").style.display = "none"  
document.getElementById("Cancelled").style.display = "none"
document.getElementById("Cancelled2").style.display = "none"
document.getElementById("Logged Out").style = "costItem2" 
document.getElementById("TRXID").style.display = "none"

}

function sendTrx(){

                    let trid = localStorage.getItem("trxid")
                    let trxStatus1 = document.getElementById("Success").innerHTML
                    localStorage.setItem("trxstatus", trxStatus1)
                    let trxStatus = localStorage.getItem("trxstatus")
                    console.log(trid)
                    console.log(trxStatus)
                    console.log(document.getElementById("Merchant Name").innerText)
                    let msg;
                    if(trxStatus && trid) {
                    
                    msg = {
                                reference: trid,
                                piId: document.getElementById("actualPiId").innerText,
                                Price: document.getElementById("PaymentAmnt2").innerText,
                                dBid: document.getElementById("dBid").innerText ,
                                Merchant: document.getElementById("Merchant Name").innerText,
                                timeStamp: Date.now()
                              }
                           
                    const config = {
                                    method: 'POST',
                                    headers: {
                                              'Content-Type': 'application/json',
                                              'Access-Control-Allow-Origin': '*'
                                              },
                                    body: JSON.stringify(msg)  
                                   };
                async function emitter(){
                   const refRes = await fetch('/reference', config); //.then(response //this works both ways...sends data to server=> 
                   const refResData = await refRes.json()
                   console.log(refResData)
                   if(refResData.reference != null) {
                   localStorage.removeItem("trxid") 
                   setTimeout(function closeWindow(){
                    history.back()
                    // window.open('','_parent',''); 
                    // window.close();
                            }, 3000)
                             } 
                   clearInterval(timer3)
                 } let timer3 = setInterval(emitter, 3000)
               }

               else if(!trid || cancelTrx){
                let msg =     {
                                reference: "logged out",
                                piId: document.getElementById("actualPiId").innerText,
                                Price: document.getElementById("PaymentAmnt2").innerText,
                                dBid: document.getElementById("dBid").innerText ,
                                Merchant: document.getElementById("Merchant Name").innerText,
                                timeStamp: Date.now()
                              }
                           
                    const config = {
                                    method: 'POST',
                                    headers: {
                                              'Content-Type': 'application/json',
                                              'Access-Control-Allow-Origin': '*'
                                              },
                                    body: JSON.stringify(msg)  
                                   };
                async function emitter(){
                   const refRes = await fetch('/reference', config); //.then(response //this works both ways...sends data to server=> 
                   const refResData = await refRes.json()
                   
                   localStorage.removeItem("trxid") 
                   clearInterval(timer3)
                   if(refResData) { 
                    setTimeout(function closeWindow(){
                    history.back()
                    // window.open('','_parent',''); 
                    // window.close();
                            }, 3000)
                    }
                 } let timer3 = setInterval(emitter, 3000)
                 
               }
localStorage.removeItem("Price")
localStorage.removeItem("Merchant")
localStorage.removeItem("cancelled")  
localStorage.removeItem("piId")

              }

