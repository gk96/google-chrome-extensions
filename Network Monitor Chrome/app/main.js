// Copyright 2020 Gautham K. All rights reserved.

// --------------------- Background Script for Network Monitor ------------------------------

var port = null;
var upload ; // Upload Speed
var download ; // Download Speed
var myChart = null; // Chart Canvas
var time = 0; // Time Keeper

// Reset WindowId to -1 on each reload
chrome.runtime.onInstalled.addListener(function (){
chrome.storage.sync.set({
  "option": 0,
  "windowId": -1,
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
          chrome.windows.create({url: "main.html", type: "popup"}, function(window){
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


function onNativeMessage(message) {
  
  var speeds = message.text.split(" ");
  //console.log(speeds);
  if(document.getElementById('up') != null ||  document.getElementById('down') != null)
  {
    chrome.storage.sync.get("speed", function (obj) {
      // Speed Unit Change Checking
      if(obj.speed == "1")
      {
        speeds[0]/=1024*8;
        speeds[1]/=1024*8;
        document.getElementById('down').innerText = speeds[1] ;
        document.getElementById('up').innerHTML = speeds[0] ;
        document.getElementById('speedUp').innerHTML = '<b id ="speedUp">Mbps</b>' ;
        document.getElementById('speedDown').innerHTML = '<b id ="speedDown">Mbps</b>' ;
      }
      else
      {
        document.getElementById('down').innerText = speeds[1] ;
        document.getElementById('up').innerHTML = speeds[0] ;
        document.getElementById('speedUp').innerHTML = '<b id ="speedUp">Kbps</b>' ;
        document.getElementById('speedDown').innerHTML = '<b id ="speedDown">Kbps</b>' ;
      }
    });
    
  
    time = time + 1;
    upload = {x : time, y: speeds[0]};
    download = {x : time, y: speeds[1]};
      if(time > 1)
      {
        //Update Chart if time elapsed 1 sec
        addData(myChart,upload,download);
      }
      else
      {
        // Initial Chart Render with default values
        renderChart([{x: 0, y: 0}],[{x: 0, y: 0}]);
      }
    }
  // Set Tool tip of Extension 
  chrome.browserAction.setTitle({
    title:'Speed Meter \n\nDownload : ' + speeds[1] + ' Kbps\nUpload : ' + speeds[0] +' Kbps'
  });
  //Setting the Badge of Extension to whichever speed is greater
  if(speeds[1] >= speeds[0])
  {
    chrome.browserAction.setBadgeText({text: '\u2193' +speeds[1]});
    chrome.browserAction.setBadgeBackgroundColor({ color: "#FF0000"});
  }

  else
  {
    chrome.browserAction.setBadgeText({text: '\u2191' +speeds[0]});
    chrome.browserAction.setBadgeBackgroundColor({ color: "#2d862d"});
  }

}

function onDisconnected() {
  console.log("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  connect();
}


function connect() {
  // Connecting to Native Python App to receive Network speeds
  var hostName = "com.gk.netmon";
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  
}

function addData(chart, updata, downdata) {
  // Updating Chart Values Dynamically
  chart.data.datasets[0].data.push(updata); 
  chart.data.datasets[1].data.push(downdata);
  if(time > 12)
  {
    chart.data.datasets[0].data.shift(); 
    chart.data.datasets[1].data.shift();
  }
  chart.update();

}

function renderChart(uploadData, downloadData) {
  var ctx = document.getElementById("myChart");
 
    myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
    	  {
          label: 'Upload',
          data: uploadData,
          showLine: true,
          fill: false,
          borderColor: 'rgba(0, 200, 0, 1)'
    	  },
        {
          label: 'Download',
          data: downloadData,
          showLine: true,
          fill: false,
          borderColor: 'rgba(200, 0, 0, 1)'
    	  }
      ]
    },
    options: {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time (sec)'
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero:true
          },
          scaleLabel: {
            display: true,
            labelString: 'Kilobytes (Kb)'
          }
        }]
      },
    }
  });
}


// Starting of the Connection
connect();

