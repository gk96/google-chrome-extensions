// Copyright 2020 Gautham K. All rights reserved.
// ------------------Background Script for netstat-----------------------------------

k = [] // Global Array for storing incoming JSON data
var port = null;

function onDisconnected() {
    console.log("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
  }


function onNativeMessage(message) {
    k.push(message);

    for (var i = 0; i < k.length; i++) 
    {
        table = document.querySelector('#networkActivity > tbody');

        if(table !=null)
        { //Deleting Previous Rows of Table 
            while (table.childNodes.length > 9) {
                table.removeChild(document.querySelector('#networkActivity > tbody').childNodes[0]);
              }
        // Adding New Rows to table 
        tr = document.querySelector('#networkActivity > tbody').insertRow(-1);
        for (var j in k[i]) 
        {
            var tabCell = tr.insertCell(-1); 
            tabCell.innerHTML = k[i][j];
        }
        }
        // Clearing the array to optimize memory
        while(k.length > 0) {
            k.pop();
        }
    }  
}


  
function connect() {
// Connecting to Native Python App to receive Network speeds
var hostName = "com.gk.netstat";
port = chrome.runtime.connectNative(hostName);
port.onMessage.addListener(onNativeMessage);
port.onDisconnect.addListener(onDisconnected);
}

// Start of the Connection
connect();
