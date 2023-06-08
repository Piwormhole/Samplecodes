class userData{
  async collectPiId() {
      const enterUser = async () => {
        const piUser = prompt(
          "Please enter your Pi user name without the @ sign. Note that this is case sensitive"
        );
        if (piUser == null || piUser == "" || !piUser) {
          alert("Your Pi user name is required before you can make payment");
          return false;
        } else {
          return piUser
        }
      }
     return await enterUser();
  }

}

class PostMessage{
  constructor (Merchant, finalPrice, piId, timeStamp, url, PC) {
    this.Merchant = Merchant
    this.finalPrice = finalPrice
    this.piId = piId
    this.timeStamp = timeStamp
    this.url = url
    this.PC = PC
  }

  async startPayment(data, refUrl)  {

     async function sendFinalBill() { 
         try {
                         let message = JSON.stringify(data)
                          const options = {
                                            method: 'POST',
                                            headers: {
                                              //'Access-Control-Allow-Origin': '*',
                                              'Authorization' : key,
                                              'Content-Type': 'application/json'

                                                      },
                                            body: message  
                                           }
                          const bill = await fetch('http://192.168.1.174:8020/merchant', options)
                          const billResponse = await bill.json()
                          console.log(billResponse)
                    if(billResponse[0].Merchant == data.Merchant){ // need to check if this returns the merchant name
                    const ua = navigator.userAgent
                  if (/android/i.test(ua)) {
                            const url = 'https://sandbox.minepi.com/app/piwormhole'
                            processWindow = window.location.assign(url)
                            clearInterval(timer)
                               function run() {
                               getConfirmation(billResponse[0]._id)
                               }setTimeout(run, 5000)
                  }
                 else if (/iPad|iPhone|iPod/.test(ua)){
                    
                   processWindow = window.location.assign("pi://piwormhole.app")
                     clearInterval(timer); 
                     function run() {
                     getConfirmation(billResponse[0]._id)
                               }setTimeout(run, 5000)
                } else { 
                     let processWindow; 
                     processWindow = window.open('https://sandbox.minepi.com/app/piwormhole');  
                      clearInterval(timer)
                           function run() {
                               getConfirmation(billResponse[0]._id)
                               }setTimeout(run, 5000)
                         } 
                       }  
                      } catch(err) {
                        console.log("Oops! Something went wrong when initialising payment")
                      }                      
               } let timer =setInterval(sendFinalBill, 5000) 
          
async function getConfirmation(xyz){
       try {       
       if(xyz) {
          const options2 = {
                             method: 'GET',
                             headers: {
                                     //  'Authorization' : `${xyz}`,
                                       'Authorization' : `ddffttt`,
                                       'Content-Type': 'application/json'
                                       }
                           }
              const refRes = await fetch(refUrl, options2);
              const refResData = await refRes.json()
              let status;
              if(refResData.dBid == xyz && refResData.reference != "not completed") {
              //  console.log("success")  
              localStorage.setItem("Status", "successful")
                return status =  "successful"
                 }  else if(refResData.reference == 'not completed' && refResData.dBid == xyz) {
                  localStorage.setItem("Status", "Payment not completed")
                   console.log("Payment not completed")
               return  status = "Payment not completed" // console.log("Payment not completed")
              // return  status = console.log("Payment not completed")
              } 
            }
          } catch(err){
           console.log("Oops! Something went wrong. Error when fetching Payment Status")
            console.error(err)
          }
       } 
   }
 }

 class Status {
  async getStatus(){
   return localStorage.getItem(`Status`)
   }
 }
