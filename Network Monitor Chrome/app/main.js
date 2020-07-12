// Copyright 2020 Gautham K. All rights reserved.

// --------------------- Background Script for Network Monitor ------------------------------

var port = null;
var upload ; // Upload Speed
var download ; // Download Speed
var myChart = null; // Chart Canvas
var time = 0; // Time Keeper
var speedUnit // Speed Unit

// Reset WindowId to -1 on each reload
chrome.runtime.onInstalled.addListener(function (){
chrome.storage.sync.set({
  "option": 0,
  "windowId": -1,
  "speed": 2
}, function() {
// Update status to let user know options were saved. TODO: Remove After Merge to master
  console.log("option saved!!");
});

});

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

// Display as Popup or tabbed window
chrome.browserAction.onClicked.addListener(function() { 

  chrome.storage.sync.get("option", function (obj) {      
    if(obj.option == "0")
    {
      chrome.storage.sync.get("windowId", function (obj) {
        if (obj.windowId == undefined || obj.windowId == -1 )
        {
          console.log("inside pop");
          chrome.windows.create({url: "main.html", type: "popup", width:780}, function(window){
            // Change Status on popup close
            chrome.windows.onRemoved.addListener(function(windowid){
              console.log(windowid);
              chrome.storage.sync.get("windowId", function (obj) {      
              if(obj.windowId == windowid)
              { // Clearing Window in Stroage
                chrome.storage.sync.set({
                  "windowId": -1,
                }, function() {
              // Update status to let user know options were saved. TODO: Remove After Merge to master
                console.log("option saved!!");
                });
              }
            });
        
            }); 
            chrome.storage.sync.set({
              "windowId": window.id,
            }, function() {
            // Update status to let user know options were saved. TODO: Remove After Merge to master
              console.log("option saved!!");
            });
          }); 
        }
      });   
    }
    else
    {
      chrome.browserAction.setPopup({
        popup: 'main.html'
    });
    }
  });
});

/**
* Function to set Speed Unit
* 
* @param {Array} speeds current upload and Download Speed
*/
function setSpeedUnit(speeds){
  chrome.storage.sync.get("speed", function (obj) {
    if(obj.speed == "1")
      {
        this.speedUnit = 'Mbps'
      }
      else if (obj.speed == "0"){
        this.speedUnit = 'Kbps'
      }
      else{
        if(speeds[0] > 1024 || speeds[1] > 1024 )
        {
          speeds[0] = (speeds[0]/1024).toFixed(2)
          speeds[1] = (speeds[1]/1024).toFixed(2)
          this.speedUnit = 'Mbps'
        }
        else 
        {
          this.speedUnit = 'Kbps'
        }
      }
  })
}

/**
* Function to be executed when message is received from native app
* 
* @param {String} message The Message
*/
function onNativeMessage(message) {
  
  var speeds = message.text.split(" ");
  setSpeedUnit(speeds);
  
  //console.log(speeds);
  if(document.getElementById('up') != null ||  document.getElementById('down') != null)
  {
    chrome.storage.sync.get("speed", function (obj) {
      // Speed Unit Change Checking
      if(obj.speed == "1")
      {
        this.speedUnit = 'Mbps'
        speeds[0]=(speeds[0]/(1024)).toFixed(2);
        speeds[1]=(speeds[1]/(1024)).toFixed(2);

        document.getElementById('down').innerText = speeds[1] ;
        document.getElementById('up').innerHTML = speeds[0] ;
        document.getElementById('speedUp').innerHTML = speedUnit ;
        document.getElementById('speedDown').innerHTML = speedUnit ;
        renderGauge(speeds[0], speeds[1]);
      }
      else if( obj.speed == "0")
      {
        speedUnit = 'Kbps'
        document.getElementById('down').innerText = speeds[1] ;
        document.getElementById('up').innerHTML = speeds[0] ;
        document.getElementById('speedUp').innerHTML = speedUnit ;
        document.getElementById('speedDown').innerHTML = speedUnit ;
        renderGauge(speeds[0], speeds[1]);
      }
      else
      {
        document.getElementById('down').innerText = speeds[1] ;
        document.getElementById('up').innerHTML = speeds[0] ;
        document.getElementById('speedUp').innerHTML = speedUnit ;
        document.getElementById('speedDown').innerHTML = speedUnit ;
        renderGauge(speeds[0], speeds[1]);
      }
    });
    
  
    time = time + 1;
    if(speedUnit == 'Kbps')
    {
      upload = {x : time, y: speeds[0]};
      download = {x : time, y: speeds[1]};
    }
    else
    {
      upload = {x : time, y: (speeds[0]/1024).toFixed(2)};
      download = {x : time, y: (speeds[1]/1024).toFixed(2)};
    }
    
      if(time > 1 )
      {
        //Update Chart if time elapsed 1 sec
        renderChart(upload, download)
      }
      else
      {
        // Initial Chart Render with default values
        renderChart({x: 0, y: 0},{x: 0, y: 0});
      }
    }
  // Set Tool tip of Extension 
  chrome.browserAction.setTitle({
    title:'Speed Meter \n\nDownload : ' + (speedUnit == 'Mbps' ? (speeds[1]/1024).toFixed(2) : speeds[1]) + ' '+ speedUnit 
    +'\nUpload : ' + (speedUnit == 'Mbps' ? (speeds[0]/1024).toFixed(2) : speeds[0]) +' '+ speedUnit 
  });
  //Setting the Badge of Extension to whichever speed is greater
  if(speeds[1] >= speeds[0])
  {
    chrome.browserAction.setBadgeText({text: '\u2193' + (speedUnit == 'Mbps' ? (speeds[1]/1024).toFixed(2) : speeds[1]) });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000"});
  }

  else
  {
    chrome.browserAction.setBadgeText({text: '\u2191' + (speedUnit == 'Mbps' ? (speeds[0]/1024).toFixed(2) : speeds[0] )});
    chrome.browserAction.setBadgeBackgroundColor({ color: "#2d862d"});
  }

}

/**
* Function to be executed when extension disconnects from native app
*/
function onDisconnected() {
  console.log("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  connect();
}

/**
* Function to connect to native app
*/
function connect() {
  // Connecting to Native Python App to receive Network speeds
  var hostName = "com.gk.netmon";
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

/**
* Function for rendering gauge
* 
* @param {String} upSpeed Upload Speed
* @param {String} downSpeed Download Speed   
*/
function renderGauge(upSpeed, downSpeed){
  myGauge = document.querySelector("gauge-component");
  myGauge.setAttribute('upSpeed', upSpeed);
  myGauge.setAttribute('downSpeed', downSpeed);
  myGauge.setAttribute('speedUnit', document.getElementById('speedUp').innerHTML)
}

/**
* Function for rendering chart
* 
* @param {String} uploadData Upload Speed
* @param {String} downloadData Download Speed   
*/
function renderChart(uploadData, downloadData) {
  myChart = document.querySelector("chart-component");
  myChart.setAttribute('uploadData', JSON.stringify(uploadData));
  myChart.setAttribute('downloadData', JSON.stringify(downloadData));
}

// Starting of the Connection
connect();

