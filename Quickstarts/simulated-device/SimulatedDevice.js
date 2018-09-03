// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// The device connection string to authenticate the device with your IoT hub.
//
// NOTE:
// For simplicity, this sample sets the connection string in code.
// In a production environment, the recommended approach is to use
// an environment variable to make it available to your application
// or use an HSM or an x509 certificate.
// https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-security
//
// Using the Azure CLI:
// az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table
var connectionString = 'HostName=HackathonHub.azure-devices.net;DeviceId=HackathonDevice;SharedAccessKey=ypzj3EL1d7d3EIfg2Z/2HuFeiz11lxxxvD8eDgFE3oM=';

// Using the Node.js Device SDK for IoT Hub:
//   https://github.com/Azure/azure-iot-sdk-node
// The sample connects to a device-specific MQTT endpoint on your IoT Hub.
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

var inventory = ['milk', 'eggs'];
var foodItems = ['milk', 'eggs', 'cheese', 'tomatoes', 'butter'];

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);
function addFunction(){
	
	var item = Math.floor(Math.random() * foodItems.length);
	
	var randomAddedItem = foodItems[item];
	
	
	
	if (inventory.indexOf(randomAddedItem) == -1) {
		inventory.push(randomAddedItem);
		console.log(randomAddedItem + ' added');
	} else {
		console.log(randomAddedItem + ' has already been added');
	}
	
	
	
	
	
}

function removeItem(){
	
	var item = Math.floor(Math.random() * inventory.length);
	
	var randomRemovedItem = foodItems[item];
	
	if (inventory.indexOf(randomRemovedItem) != -1) {
		inventory.splice(inventory.indexOf(randomRemovedItem),1);
		console.log(randomRemovedItem + ' removed');
	} else {
		console.log(randomRemovedItem + ' has already been removed');
	}
		
}

// Create a message and send it to the IoT hub every second
setInterval(function(){
  // Simulate telemetry.
  
  
  var randomAction = Math.floor(Math.random() * 2);
  
  var randomItem;
  
  
  var message = new Message(JSON.stringify({
	inventory : inventory
  }));
  
  

  

  if ( randomAction == 0 ){
	  removeItem();
  } else {
	addFunction();
	}
	
	console.log('Current inventory: ' + inventory);
	

  // Send the message.
  client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      // console.log('message sent');
    }
  });
}, 2000);


