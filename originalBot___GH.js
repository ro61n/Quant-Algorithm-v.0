const api = require('binance');

const binanceWS = new api.BinanceWS(true); // Argument specifies whether the responses should be beautified, defaults to true
const streams = binanceWS.streams;

const fs = require('fs');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



const binanceRest = new api.BinanceRest({
    key: '', // <--- INPUT: Get this from your account on binance.com
    secret: '', // <--- INPUT: Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false,
    /*
     * Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
     * default those keys will be replaced with more descriptive, longer ones.
     */
    handleDrift: false
    /* Optional, default is false.  If turned on, the library will attempt to handle any drift of
     * your clock on it's own.  If a request fails due to drift, it'll attempt a fix by requesting
     * binance's server time, calculating the difference with your own clock, and then reattempting
     * the request.
     */
});



var sellOrderId = '';



var symbolAAAA = 'LSKBTC';	// <--- INPUT: Coin and base coin (e.g. 'LSKBTC' for trading LST/BTC).
var symAAAA = 'LSK';		// <--- INPUT: Coin without base coin (e.g. 'LSK' for trading LST/BTC).


var upMinAAAA=1.03;		// <--- INPUT: Minimum profit before take profit instructions are activated (e.g. '1.03' for 3% profit).
var downMinAAAA=0.99;	// <--- INPUT: Maximum loss before exit instructions are activated (e.g. 1-0.01 = '0.99' for 1% loss). 


var minOrderBookQtyAAAA = 200000;	// <--- INPUT: Input Volume. 

var halfBalanceAAAA = 1;	// <--- INPUT: Keep on 1. Was more relevant to older code. Might incur problems if quantity of balance is less than 0.5 due to Math.round function used in code.


var stopLossSell_PriceAAAA = 0;
var stopLossSell_ActiveAAAA = false;
var stop_PriceAAAA = 0;
var myUpdatedBalance = 0;
var limit_PriceAAAA = 0;

var stopLossBuy_PriceAAAA = 0;
var stopLossBuy_ActiveAAAA = false;

var fmSAAA=0;
var fmaxSAAA=0;

var ifStatementA = 0;
var limitOrderSell = false;




				// <--- EXPLANATION: Code below checks if stop loss sell order existed before the program was executed.
					binanceRest.openOrders({
						symbol: symbolAAAA
					})
					.then((dataOpenOrders) => {
						for (var i =0; i< dataOpenOrders.length; i++) {
							if ((dataOpenOrders.length>0) && (dataOpenOrders[i].side=='SELL') && (dataOpenOrders[i].type=='STOP_LOSS_LIMIT') ){
								stopLossSell_ActiveAAAA = true;
								stopLossSell_PriceAAAA = dataOpenOrders[i].price;
								//console.log("AYYYY ------------ TRUE STOP LOSS ACTIVE");
							}
							else {
								//console.log("NNNNAAAYYYYY ------------ FALSE STOP LOSS NOT ACTIVE");
							}
						}
					})
					.catch((err) => {
						console.error(err);
						
							let orderJSON = {  
								errorMessage: "ERROR CODE: 1"
							};
							let data = JSON.stringify(orderJSON);  
							fs.appendFile('order_log.json', '\n'+data+',', function (err) {
							if (err) throw err;
								//console.log('Saved!');
							});
					});
					//end of old code
					
					
			// <--- EXPLANATION: Code below checks if stop loss buy order existed before the programme was executed. Code below has depreciated as programme no longer buys coins.
					binanceRest.openOrders({
						symbol: symbolAAAA
					})
					.then((dataOpenOrders) => {
						for (var i =0; i< dataOpenOrders.length; i++) {
							if ((dataOpenOrders.length>0) && (dataOpenOrders[i].side=='BUY') && (dataOpenOrders[i].type=='STOP_LOSS_LIMIT') ){
								stopLossBuy_ActiveAAAA = true;
								stopLossBuy_PriceAAAA = dataOpenOrders[i].price;
								//console.log("AYYYY ------------ TRUE STOP LOSS ACTIVE");
							}
							else {
								//console.log("NNNNAAAYYYYY ------------ FALSE STOP LOSS NOT ACTIVE");
							}
						}
					})
					.catch((err) => {
						console.error(err);
						
							let orderJSON = {  
								errorMessage: "ERROR CODE: 2"
							};
							let data = JSON.stringify(orderJSON);  
							fs.appendFile('order_log.json', '\n'+data+',', function (err) {
							if (err) throw err;
								//console.log('Saved!');
							});
						
					});
					
					

					
					
				
					
					
					
					
			// <--- EXPLANATION: Websocket streams.
binanceWS.onCombinedStream([
        streams.depthLevel(symbolAAAA, 5)//,
      //  streams.kline('STORMBTC', '5m')
    ],
	
(streamEvent) => {
   switch(streamEvent.stream) {
	
	case streams.depthLevel(symbolAAAA, 5):
                
				
   ///////////////SELL ORDER ALGORITHM
		
		
		
   
				if ((stopLossSell_ActiveAAAA==true) && (stopLossSell_PriceAAAA<streamEvent.data.bids[0][0]) ){ // <--- EXPLANATION: If the stop loss sell order exists and moves to below the first bid price (streamEvent.data.bids[0][0])), due to an increase in the trading price, then the code will cancel the stop loss sell order at that price and place a stop loss sell order at a higher price for a higher profit.
						binanceRest.openOrders({
						symbol: symbolAAAA
					})
					.then((dataOpenOrders) => {
						if (dataOpenOrders.length>0){
							var placeNewStopLossSellOrder='false';
							for (var i =0; i< dataOpenOrders.length; i++) {
								if ( (dataOpenOrders[i].side=='SELL') && (dataOpenOrders[i].type=='STOP_LOSS_LIMIT') && (dataOpenOrders[i].price < streamEvent.data.bids[0][0]) ){
														
														cancelSellCoin(symbolAAAA, dataOpenOrders[i].orderId, "Cancel Order - code 6");
														console.log("Cancel sell coin code: 6");
							
								}
							
							}
							
						}
						else {
							stopLossSell_ActiveAAAA = false;
						}
					})
					.catch((err) => {
						console.error(err);
						
							let orderJSON = {  
								errorMessage: "ERROR CODE: 3"
							};
							let data = JSON.stringify(orderJSON);  
							fs.appendFile('order_log.json', '\n'+data+',', function (err) {
							if (err) throw err;
								//console.log('Saved!');
							});
						
					});	
							
						
								binanceRest.account()		
									.then((dataA) => {
									
						
									
									
									
									
										for (var i =0; i< dataA.balances.length ;i++) {
											if (dataA.balances[i].asset==symAAAA){
												if (Math.floor((dataA.balances[i].free)) > halfBalanceAAAA){
												var percReturn =  ((streamEvent.data.bids[0][0]/outputB)-1)*100;
												var pL = "";
												if (percReturn<0){
													pL="LOSS";
												}
												else {
													pL="PROFIT";
												}
												
												var dateTime = getDateAndTime();
														getBTCAmount();
													
													var i_price = streamEvent.data.bids[0][0];
													var i_stopPrice = streamEvent.data.bids[1][0];
													var i_quantity = Math.floor((dataA.balances[i].free));
													console.log("i-Price:"+i_price+" -stop:"+i_stopPrice);
													
													
												
													stopLossSellCoin(symbolAAAA, i_price, i_stopPrice, i_quantity, percReturn, "SELL - Stop Loss - code 7"); // <--- EXPLANATION: See function below.
													
														stopLossSell_PriceAAAA = streamEvent.data.bids[0][0];
														stop_PriceAAAA = streamEvent.data.bids[1][0];
														limit_PriceAAAA = streamEvent.data.bids[0][0];
														stopLossSell_ActiveAAAA = true;
														myUpdatedBalance = Math.floor((dataA.balances[i].free));
													console.log("Stop loss sell created code: 7");
													
												}
												
											}
										}
									})
									.catch((err) => {
										console.error(err);
										
										let orderJSON = {  
											errorMessage: "ERROR CODE: 3"
										};
										let data = JSON.stringify(orderJSON);  
										fs.appendFile('order_log.json', '\n'+data+',', function (err) {
										if (err) throw err;
											//console.log('Saved!');
										});
										
									});	
							
				}
				else {// <--- EXPLANATION: If a stop loss sell order does not exist, the programme will either check when it is time to place one or to exit for the smallest loss possible.
				
				
					binanceRest.openOrders({
						symbol: symbolAAAA
					})
					.then((dataOpenOrders) => {
						////
						binanceRest.myTrades({
							symbol: symbolAAAA,
							limit: 10
						})
						.then((data) => {
							var i=0;
							while(i<data.length){//rather just make it a for loop
								if (data[i].isBuyer == true){
									outputB = data[i].price;
								}
								i++;
							}
							
							finalMinSellAAAA = outputB*upMinAAAA;
							
							fmSAAA = finalMinSellAAAA;
							
							finalExitSellAAAA = outputB*downMinAAAA;
							
							// <--- EXPLANATION: The 3 lines below were just for me to see the algorithm constantly streaming data 
							console.log("1. ASK Order to sell must be higher than finalMaxSellAAAA: "+fmaxSAAA+"...  Order price (ask) is:"+streamEvent.data.asks[0][0]);
							console.log("1. BUY Order to sell must be higher than finalMinSellAAAA: "+finalMinSellAAAA+"...  Order price (bid) is:"+streamEvent.data.bids[0][0]);
							console.log("1. Exit order must be lower than finalExitSellAAAA: "+finalExitSellAAAA+"...  Order price (bid) is:"+streamEvent.data.bids[0][0]);
							
							
							
							
							if (streamEvent.data.bids[0][0]>finalMinSellAAAA){ // <--- EXPLANATION: Order to sell must be higher than finalMinSellAAAA. Order price is: streamEvent.data.bids[0][0]. This will create a stop loss sell order for a profit.
							
									if (dataOpenOrders.length>0){
										for (var i =0; i< dataOpenOrders.length; i++) {
											if ( (dataOpenOrders[i].side=='SELL') && (dataOpenOrders[i].type=='LIMIT') && (dataOpenOrders[i].price < streamEvent.data.asks[1][0]) ){//has to be lower so that it can be cancelled before getting processed
							
														cancelSellCoin(symbolAAAA, dataOpenOrders[i].orderId, "Cancel Order - code 4");
														console.log("Cancel sell coin code: 4");
													
											}
										}
								
									}
									
									binanceRest.account()		
									.then((dataA) => {
										for (var i =0; i< dataA.balances.length ;i++) {
											if (dataA.balances[i].asset==symAAAA){
												//if (dataA.balances[i].free > 15000){
												if (Math.floor((dataA.balances[i].free)) > halfBalanceAAAA){
													
													var i_price = streamEvent.data.bids[0][0];
													var i_stopPrice = streamEvent.data.bids[1][0];
													var i_quantity = Math.floor((dataA.balances[i].free));
													//console.log("i-Price:"+i_price+" -stop:"+i_stopPrice);
													//console.log("Stop Loss sell coin code: 4 i_price:"+i_price+" & i_stopPrice:"+i_stopPrice+" & i_quantity:"+i_quantity);
													
													var percReturn =  ((streamEvent.data.bids[0][0]/outputB)-1)*100;
													
													
													
													
													stopLossSellCoin(symbolAAAA, i_price, i_stopPrice, i_quantity, percReturn, "SELL - Stop Loss - code 5"); // <--- EXPLANATION: See function at the bottom of the code
													
														stopLossSell_PriceAAAA = streamEvent.data.bids[0][0];
														stop_PriceAAAA = streamEvent.data.bids[1][0];
														limit_PriceAAAA = streamEvent.data.bids[0][0];
														stopLossSell_ActiveAAAA = true;
														myUpdatedBalance = Math.floor((dataA.balances[i].free));
														console.log("Stop Loss sell coin code: 5");
																
														
												}
											}
										}
									})
									.catch((err) => {
										console.error(err);
										
										let orderJSON = {  
											errorMessage: "ERROR CODE: 4"
										};
										let data = JSON.stringify(orderJSON);  
										fs.appendFile('order_log.json', '\n'+data+',', function (err) {
										if (err) throw err;
											//console.log('Saved!');
										});
										
									});	
							
								
							}
							else if (streamEvent.data.bids[0][0]<=finalExitSellAAAA){	// <--- EXPLANATION: Order to exit must be less than finalMinSellAAAA. Order price is: streamEvent.data.bids[0][0]. This will create a stop loss sell order for a loss to bigger losses.
					
										binanceRest.openOrders({
											symbol: symbolAAAA
										})
										.then((dataOpenOrders) => {
							
											if (dataOpenOrders.length>0){
												for (var i =0; i< dataOpenOrders.length; i++) {
													if ((dataOpenOrders[i].side=='SELL') && (dataOpenOrders[i].price > finalExitSellAAAA) ){
														cancelSellCoin(symbolAAAA, dataOpenOrders[i].orderId, "Cancel Order - code 2");
														console.log("Cancel sell coin code: 2");
										
														
										
													}
												}
								
								
											}
								
								
								
								
								binanceRest.account()		
								.then((dataA) => {
									for (var i =0; i< dataA.balances.length ;i++) {
										if (dataA.balances[i].asset==symAAAA){
											
											
											if (Math.floor((dataA.balances[i].free)) > halfBalanceAAAA){
											
												
													var i_price = streamEvent.data.bids[0][0];
													var i_stopPrice = streamEvent.data.bids[1][0];
													var i_quantity = Math.floor((dataA.balances[i].free));
													console.log("i-Price:"+i_price+" -stop:"+i_stopPrice);
													
													var percReturn =  ((streamEvent.data.bids[0][0]/outputB)-1)*100;
													
													stopLossSellCoin(symbolAAAA, i_price, i_stopPrice, i_quantity, percReturn, "SELL - Stop Loss - code 1"); // <--- EXPLANATION: See function below.
														stopLossSell_PriceAAAA = streamEvent.data.bids[1][0];
														stop_PriceAAAA = streamEvent.data.bids[1][0];
														limit_PriceAAAA = streamEvent.data.bids[0][0];
														stopLossSell_ActiveAAAA = true;
														myUpdatedBalance = Math.floor((dataA.balances[i].free));
													console.log("Stop loss sell created code: 14");
													
													
												 
												 
											}
										}
									}
								})
								.catch((err) => {
									console.error(err);
									
										let orderJSON = {  
											errorMessage: "ERROR CODE: 7"
										};
										let data = JSON.stringify(orderJSON);  
										fs.appendFile('order_log.json', '\n'+data+',', function (err) {
										if (err) throw err;
											//console.log('Saved!');
										});
									
								});
								
								
								////////////////////////////////////////////////////////////////////
											
								
								
											
										})
										.catch((err) => {
											console.error(err);
							
												let orderJSON = {  
													errorMessage: "ERROR CODE: 9"
												};	
												let data = JSON.stringify(orderJSON);  
												fs.appendFile('order_log.json', '\n'+data+',', function (err) {
													if (err) throw err;
														//console.log('Saved!');
												});
							
										});
							}
							else {
								
							}
							
		
						})
						.catch((err) => {
							console.error(err);
							
										let orderJSON = {  
											errorMessage: "ERROR CODE: 5"
										};
										let data = JSON.stringify(orderJSON);  
										fs.appendFile('order_log.json', '\n'+data+',', function (err) {
										if (err) throw err;
											//console.log('Saved!');
										});
							
						});
	
					})
					.catch((err) => {
						console.error(err);
						
										let orderJSON = {  
											errorMessage: "ERROR CODE: 6"
										};
										let data = JSON.stringify(orderJSON);  
										fs.appendFile('order_log.json', '\n'+data+',', function (err) {
										if (err) throw err;
											//console.log('Saved!');
										});
						
						
					});
				}
				
				
	//end of AAAA			
  
				
   
			
				
		
		
				
				
                break;
				
        //    case streams.kline('STORMBTC', '5m'):
         //       console.log('Kline Event', streamEvent.data);
          //      break;
				
				
				
				 }
    }
);


// <--- EXPLANATION: Functions to place orders or cancel orders are below in the form of promises. These functions work with the binance npm package. See Readme file for more information on Binance NPM.



function cancelSellCoin(sym, order_ID, codeMessage){
	binanceRest.cancelOrder({
        symbol: sym,
		orderId: order_ID
    })
    .then((data) => {
        console.log(data);
		
			var now_JS = new Date();
														var dateTime = getDateAndTime();
												
														let orderJSON = {   date:dateTime,		orderType: 'SELL',     symbol: sym,     orderID: order_ID,     date_JS: now_JS,	 orderMessage: codeMessage };
														let data_json = JSON.stringify(orderJSON);  
														fs.appendFile('order_log.json', '\n'+data_json+',', function (err) {
															if (err) throw err;
															//console.log('Saved!');
														});
		
		
    })
    .catch((err) => {
        console.error(err);
	});
}

function cancelBuyCoin(sym, order_ID){
	binanceRest.cancelOrder({
        symbol: sym,
		orderId: order_ID
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
	});
}

function stopLossSellCoin(sym, i_price, i_stopPrice, i_quantity, percReturn, codeMessage){

	binanceRest.newOrder({
        symbol: sym,
		side: 'SELL',
		type: 'STOP_LOSS_LIMIT',
		timeInForce: 'GTC',
		quantity: i_quantity,
		price: i_price,
		stopPrice: i_stopPrice
	})
	.then((data) => {
		sellOrderId = data.orderId;
        console.log(data);
		
		
														var now_JS = new Date();
														var dateTime = getDateAndTime();
														getBTCAmount();
														
														let orderJSON = {   date:dateTime,		orderType: 'SELL', symbol: sym, entryPrice:outputB, orderPrice: i_price, orderStopPrice: i_stopPrice,  orderQty: i_quantity, pL:"LOSS", percentageReturn: percReturn,   orderID:data.orderId,     date_JS: now_JS,	 orderMessage: codeMessage };
														let data_json = JSON.stringify(orderJSON);  
														fs.appendFile('order_log.json', '\n'+data_json+',', function (err) {
															if (err) throw err;
															//console.log('Saved!');
														});
		
		
		
    })
    .catch((err) => {
        console.error(err);
    });
	
}

function stopLossBuyCoin(sym, i_price, i_stopPrice, i_quantity){

	binanceRest.newOrder({
        symbol: sym,
		side: 'BUY',
		type: 'STOP_LOSS_LIMIT',
		timeInForce: 'GTC',
		quantity: i_quantity,
		price: i_price,
		stopPrice: i_stopPrice
	})
	.then((data) => {
		sellOrderId = data.orderId;
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
	
}

function sellCoin(sym, i_price, i_quantity, percReturn, codeMessage){

	binanceRest.newOrder({
        symbol: sym,
		side: 'SELL',
		type: 'LIMIT',
		timeInForce: 'GTC',
		quantity: i_quantity,
		price: i_price
	})
	.then((data) => {
		sellOrderId = data.orderId;
        console.log(data);
		
		
														var now_JS = new Date();
														var dateTime = getDateAndTime();
														getBTCAmount();
														
														let orderJSON = {   date:dateTime,		orderType: 'SELL', symbol: sym, entryPrice:outputB, orderPrice: i_price, orderQty: i_quantity, pL:"PROFIT", percentageReturn: percReturn,   orderID:data.orderId,     date_JS: now_JS,	 orderMessage: codeMessage };
														let data_json = JSON.stringify(orderJSON);  
														fs.appendFile('order_log.json', '\n'+data_json+',', function (err) {
															if (err) throw err;
															//console.log('Saved!');
														});
		
		
    })
    .catch((err) => {
        console.error(err);
    });
	
}

function buyCoin(sym, i_price, i_quantity){

	binanceRest.newOrder({
        symbol: sym,
		side: 'BUY',
		type: 'LIMIT',
		timeInForce: 'GTC',
		quantity: i_quantity,
		price: i_price
	})
	.then((data) => {
		buyOrderId = data.orderId;
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
	
}






function getDateAndTime(){
	
														
	now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;							
														
														
}

function getBTCAmount(){


	binanceRest.account( (err, dataA) => {
		if (err) {
			console.error(err);
		} 
		else {
		
			var currentFree = [];
			var currentLocked = [];
									var currentSymbol = [];
									var cC = 0;//currentCount
									var oOuterTotalBTC=0;
									
									for (var i =0; i< dataA.balances.length ;i++) {
										var properSymbol = dataA.balances[i].asset+'BTC';
									
									
										if ( (dataA.balances[i].free>0   ) && (dataA.balances[i].asset=='BTC') ){
											oOuterTotalBTC = oOuterTotalBTC + dataA.balances[i].free;
										}
										else if ( (dataA.balances[i].locked>0   ) && (dataA.balances[i].asset=='BTC') ){
											oOuterTotalBTC = oOuterTotalBTC + dataA.balances[i].locked;
										}
										else if ( ( (dataA.balances[i].free>0) || (dataA.balances[i].locked>0) ) && (dataA.balances[i].asset!='BTC') ){
											currentFree[cC] = dataA.balances[i].free;
											currentLocked[cC] = dataA.balances[i].locked;
											currentSymbol[cC] = dataA.balances[i].asset;
											
										
											
											var currentBTC_B = 0;
										
											
											var altsBTCValue = 0;
											var jC = 0;
											
													binanceRest.tickerPrice(properSymbol, (err, dataB) => {
														if (err) {
															console.error(err);
														} 
														else {
															
															var currentBTC = 0;
															for (var j=0; j< currentSymbol.length; j++){
																var symBTC = currentSymbol[j]+'BTC';
																if (symBTC==dataB.symbol){
																	currentBTC = (+currentFree[j] + +currentLocked[j] )*dataB.price;
																	//currentBTC = (currentFree[j] )*dataB.price;
																	
																	altsBTCValue = altsBTCValue + currentBTC;
																	jC++;
															
																}	
															}					
														}
														addToArray(altsBTCValue); 
													});
										cC++;
										}
									}
									
									var finalAmountArr=[];
									 
									 var addToArray = function(param){
									
										if(param){
										//do something
	
											finalAmountArr.push(param);
											if (finalAmountArr.length == cC){
												
												var n= cC-1;
												
												var finalTotalAmount = +finalAmountArr[n] + +oOuterTotalBTC;
												console.log('->'+finalAmountArr[n]);
												//console.log(+'->'+cC);
												
													var dateTime = getDateAndTime();
													
													now_JS = new Date();
														
														let orderJSON = {  date:dateTime,	btcAmount: finalTotalAmount,   date_JS:now_JS,	 orderMessage: "updated bitcoin amount" };
														let data = JSON.stringify(orderJSON);  
														fs.appendFile('order_log.json', '\n'+data+',', function (err) {
															if (err) throw err;
															//console.log('Saved!');
														});
												
											}
										}
									}
		}												 
	});	
}
