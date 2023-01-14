let ov1 = "overlay"; 
let ov2 = "overlay2";
function on(overlay) {
  document.getElementById(overlay).style.display = "block";
}

function off(overlay) {
  document.getElementById(overlay).style.display = "none";
}
  
  let TotalAmount = () => {
    
      let item = 1
      let price = 2
      let amount = item * price

      document.getElementById("finalBill").innerHTML = amount;
      label.innerHTML = `
      <h2>Total Bill : ${amount} π</h2>
      <div id = "finalBill" ></div>
      <button id = "checkout" onclick="enterUser();" class="checkout">Pay with Pi</button> 
      <div class="cart-item">
      <img width="100" src="img.jpg" alt="" />
      <div class="details">
        <div class="title-price-x">
            <h4 class="title-price">
              <p>Apple Pie</p>
              <p class="cart-item-price"> 2 π</p>
            </h4>
            <i id = "close" onclick="removeItem(Apple1)" class="bi bi-x-lg"></i>
        </div>

        <div class="buttons">
            <div id=Apple1 class="quantity">${item}</div>
        </div>

        <h3> ${amount} π</h3>
      </div>
    </div>

      `;
   
  }; TotalAmount()


function enterUser(){
    const piUser = prompt("Please enter your Pi user name exactly as as it appears on your app without the @ sign")
    if(piUser == null || piUser == "" || !piUser) {
    alert("Your Pi user name is required before you can make payment")
    } else {
              localStorage.setItem("userId", piUser)
              setTimeout(postIt, 100)
              on(ov1)
          }
    }
    async function postIt() {
    
      async function sendFinalBill() { 
     
      let finalPrice = document.getElementById("finalBill").innerHTML;
      let userId = localStorage.getItem("userId")
      document.getElementById("checkout").disabled = true
      document.getElementById("close").style.display = "none"
                      let message1 =    { 
                                           Merchant: "Clothing Store", 
                                           finalPrice : finalPrice,
                                           piId: userId,
                                           timeStamp: Date.now()
                                        };
                      let message = JSON.stringify(message1)
                      const options = {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                                  },
                                        body: message  
                                       }
                   //   const bill = await fetch('/store', options)
                      const billtoPwh = await fetch('http://localhost:8020/merchant', options)

                      const billResponse = await billtoPwh.json()

                      if(billResponse[0].Merchant == "Clothing Store"){
                      
                      localStorage.setItem("uniqueId", billResponse[0]._id)
                      processWindow = window.open('https://sandbox.minepi.com/app/piwormhole')
                      off(ov1); on(ov2);                   
                     clearInterval(timer); 
                      }
                   function run() {
                    finalise(billResponse[0]._id, timer7)

                   }    let timer7 = setInterval(run, 5000)        
      
    } let timer =setInterval(sendFinalBill, 3000)
    
       }
       
    async function finalise(xyz, timer){
              if(xyz) {
            const refRes = await fetch('[shop server URL here]/reference2');
            const refResData = await refRes.json()
           if(!refResData[0] && processWindow.closed)
                                  { 
                                    off(ov2) 
                                    document.getElementById("checkout").disabled = false
                                    document.getElementById("clearcart").disabled = false
                                    document.getElementById("incr").style.display = "flex"
                                    document.getElementById("dec").style.display = "flex"
                                    document.getElementById("close").style.display = "flex" 
                                    setTimeout(() => {
                                      document.location.reload();
                                      }, 10000); 
                                    clearInterval(timer) 
                                  } 
            else if(refResData[0].dBid == xyz &&  refResData[0].reference != 'logged out')
                                  {
                                      clearInterval(timer)
                                      off(ov2);
                                      clearCart() 
                                      document.getElementById("empty").innerHTML = `Payment Successful. Thank you for shopping with us. Your reference number is ${refResData[0].reference} and has been sent to your email address`         
                                      setTimeout(() => {
                                      document.location.reload();
                                      }, 10000);
                                    }  
             else if(refResData[0].reference == 'logged out'&& refResData[0].dBid == xyz)
                                  { 
                                      clearInterval(timer)
                                      off(ov2) 
                                      clearCart() 
                                      document.getElementById("empty").innerHTML = `Payment was cancelled. Your shopping cart has been cleared`
                                      setTimeout(() => {
                                      document.location.reload();
                                      }, 10000);
                                    } 
             
                       }   return true 
          }