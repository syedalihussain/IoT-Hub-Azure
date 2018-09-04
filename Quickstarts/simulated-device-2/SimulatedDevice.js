// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

const chalk = require('chalk');

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
var connectionString = 'HostName=HackathonHub.azure-devices.net;DeviceId=HackathonDevice;SharedAccessKeyName=iothubowner;SharedAccessKey=oFjkTtodK/5hMxJnGdAz51+r+w7Lav8kKQXMsvGIHpk=';

// Using the Node.js Device SDK for IoT Hub:
//   https://github.com/Azure/azure-iot-sdk-node
// The sample connects to a device-specific MQTT endpoint on your IoT Hub.
var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

// Timeout created by setInterval
var intervalLoop = null;

//Global Variables
var inventory = ['milk', 'eggs'];
var foodItems = ['milk', 'eggs', 'cheese', 'tomatoes', 'butter'];

// Add Function
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

// Remove Function
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

// Function to handle the SetTelemetryInterval direct method call from IoT hub
function onSetTelemetryInterval(request, response) {
  // Function to send a direct method reponse to your IoT hub.
  function directMethodResponse(err) {
    if(err) {
      console.error(chalk.red('An error ocurred when sending a method response:\n' + err.toString()));
    } else {
        console.log(chalk.green('Response to method \'' + request.methodName + '\' sent successfully.' ));
    }
  }

  console.log(chalk.green('Direct method payload received:'));
  console.log(chalk.green(request.payload));

  // Check that a numeric value was passed as a parameter
  if (isNaN(request.payload)) {
    console.log(chalk.red('Invalid interval response received in payload'));
    // Report failure back to your hub.
    response.send(400, 'Invalid direct method parameter: ' + request.payload, directMethodResponse);

  } else {

    // Reset the interval timer
    clearInterval(intervalLoop);
    intervalLoop = setInterval(sendMessage, request.payload * 1000);

    // Report success back to your hub.
    response.send(200, 'Telemetry interval set: ' + request.payload, directMethodResponse);
  }
}

// Send a telemetry message to your hub
function sendMessage(){
  // Simulate telemetry.
  var randomAction = Math.floor(Math.random() * 2);
  
  var randomItem;
  
  
  var message = new Message(JSON.stringify({
	inventory : inventory
  }));

  // Add a custom application property to the message.
  // An IoT hub can filter on these properties without access to the message body.
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
      console.log('message sent');
    }
  });
}

// Set up the handler for the SetTelemetryInterval direct method call.
client.onDeviceMethod('SetTelemetryInterval', onSetTelemetryInterval);

// Create a message and send it to the IoT hub, initially every second.
intervalLoop = setInterval(sendMessage, 1000);
