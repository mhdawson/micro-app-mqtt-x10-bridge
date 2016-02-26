// Copyright 2015-2016 the project authors as listed in the AUTHORS file.
// All rights reserved. Use of this source code is governed by the
// license that can be found in the LICENSE file.

var socketio = require('socket.io');
var mqtt = require('mqtt');
var x10 = require('node-x10-comm');
var x10device = x10.device();

const PAGE_WIDTH = 400;
const PAGE_HEIGHT = 200;

var eventSocket = null;

var Server = function() {
}


Server.getDefaults = function() {
  return { 'title': 'mqtt - X10 bridge' };
}


var replacements;
Server.getTemplateReplacments = function() {
  if (replacements === undefined) {
    var config = Server.config;

    replacements = [{ 'key': '<DASHBOARD_TITLE>', 'value': Server.config.title },
                    { 'key': '<UNIQUE_WINDOW_ID>', 'value': Server.config.title },
                    { 'key': '<PAGE_WIDTH>', 'value': PAGE_WIDTH },
                    { 'key': '<PAGE_HEIGHT>', 'value': PAGE_HEIGHT }];

  }
  return replacements;
}


var recentActivity = new Array()
var pushActivity = function(entry) {
  var newEntry = new Date() + ':' + entry;
  recentActivity.push(newEntry);
  console.log(newEntry);
  eventSocket.emit('recent_activity', newEntry);
  if (recentActivity.length > Server.config.MaxRecentActivity) {
    recentActivity.splice(0,1);
  }
}


Server.startServer = function(server) {

  // print out the available ports to help setup
  x10.listPorts(function (ports) {
    console.log("Available ports");
    for(var i = 0; i < ports.length; i++) {
      console.log('  ' + ports[i].comName);
    }
    console.log();
  });

  x10device.open(Server.config.serialPort, () => {
    console.log('opened X10 device');

    var sendX10Command = function(house, module, command) {
      var messageBody = `H[${house}], M[${module}], C[${command}]`;
      x10device.sendCommand(house.charCodeAt(0) - 'A'.charCodeAt(0), module - 1, parseInt(command), () => {
        pushActivity('sent: ' + messageBody);
      }, () => {
        pushActivity('send failed: ' +  messageBody); 
      });
    }

    eventSocket = socketio.listen(server);

    eventSocket.on('connection', function(client) {
      for (var i = 0; i < recentActivity.length; i++) {
        eventSocket.to(client.id).emit('recent_activity', recentActivity[i]);
      }

      client.on('sendX10command', function(event) {
        sendX10Command(event.house, event.module, event.command);
      });
    });

    // setup mqtt
    var mqttOptions;
    if (Server.config.mqttServerUrl.indexOf('mqtts') > -1) {
      mqttOptions = { key: fs.readFileSync(path.join(__dirname, 'mqttclient', '/client.key')),
                      cert: fs.readFileSync(path.join(__dirname, 'mqttclient', '/client.cert')),
                      ca: fs.readFileSync(path.join(__dirname, 'mqttclient', '/ca.cert')),
                      checkServerIdentity: function() { return undefined }
      }
    }

    var mqttClient = mqtt.connect(Server.config.mqttServerUrl, mqttOptions);
    mqttClient.on('connect', function() {
      mqttClient.subscribe(Server.config.topic);
    });

    mqttClient.on('message', function(topic, message) {
      // parse out the House code, module code and command which are in the
      // format house,module,command 
      var values = message.toString().replace(/ /g,'').split(',');
      sendX10Command(values[0], values[1], values[2]);
    });
  },
  (err) => {
    console.log(err);
  });
}


if (require.main === module) {
  var path = require('path');
  var microAppFramework = require('micro-app-framework');
  microAppFramework(path.join(__dirname), Server);
}

module.exports = Server;
