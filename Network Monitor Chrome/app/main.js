// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
// var port = chrome.runtime.connectNative('com.google.chrome.example.echo');
var upload ;
var download ;
var myChart = null;
var time = 0;

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

function onNativeMessage(message) {
  
  var speeds = message.text.split(" ");
  console.log(speeds);
  if(document.getElementById('up') != null ||  document.getElementById('down') != null)
  {
    document.getElementById('down').innerText = speeds[1] ;
    document.getElementById('up').innerHTML = speeds[0] ;
  
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
  if(speeds[1] > speeds[0])
    chrome.browserAction.setBadgeText({text: '\u2193' +speeds[1]});

  else
    chrome.browserAction.setBadgeText({text: '\u2191' +speeds[0]});

}

function onDisconnected() {
  console.log("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
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
