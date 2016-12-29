# micro-app-mqtt-x10-bridge - mqtt to x10 bridge

Micro app that allows x10 commands to triggered through
mqtt. It allows you to publish an x10 command in the form of:

<PRE>
house,module,command:delay
</PRE>

to the configured mqtt topic and the brige will send out the
x10 command over a serial port to a connected X10 CM17A
transmitter module (http://www.x10.com/cm17a.html). The delay
is optional and if not specfied the command format is simply:

<PRE>
house,module,command
</PRE>

I plan to use this along with other 433Mhz connected devices to 
control light and appliances in my house.  In particular its
hard to find 433Mhz light switches some this will allow use of
x10 based ones I already have. Although I do have
433Mhz appliance modules this will also allow me to continue
to use the x10 ones that I have.  The controllers will connect
through mqtt and turn on/off devices based on time, temperature,
humidity etc.

The bridge depends on the node-x10-comm module to send the commands
to the serial port and the serialport module to interface with the
serial port itself.

The command publish to mqtt has the following elements:

* **house** is a capital letter from  A through O
* **module** is an integer between 1 and 16
* **command** is either 0 to turn on or 1 to turn off

and optionaly:

* **delay** delay in milliseconds before x10 command will be sent.


I use this with one of my Raspberry Pis (hooray for ARM Node.js !)
over a [usb-to-serial cable]
(http://www.ebay.ca/itm/301723477663?_trksid=p2060353.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)
although it should work on a regular computer as well.

The bridge also provides a GUI that displays the commands as they are sent
and also allows command to be sent directly from the display.  This is an
example of the display:

![picture of bridge display](https://raw.githubusercontent.com/mhdawson/micro-app-mqtt-x10-bridge/master/pictures/mqttx10bridge.jpg)


# Usage

After installation modify ../lib/config.json to match your configuration

The configuration entries that must be updated include:

* mqttServerUrl - url of the mqtt server to connect to.  This can either start
  with tcp:// or mqtts://. If it starts with mqtts://  there must be a subdirectory
  in the lib directory called mqttclient which contains ca.cert, client.cert,
  client.key which contain the key and associated certificates for a client
  which is authorized to connect to the mqtt server.
* topic - mqtt topic on which to listent for commands
* serialPort - the serial port that should be used to send out the commands
* MaxRecentActivity - the number of commands that will be maintained in the history
  and displayed in the GUI
* serverPort - port on which to connect to get access to the GUI
* title - title for the dashbaord paged (optional)

When the micro-app is started it will list the avialable serial ports to 
the console which can help in identifying the port to configure.

As a micro-app the bridge also supports other options like authentication and
tls for the GUI connection.  See the documentation for the micro-app-framework
for additional details.

The following is an example configuration file:

<PRE>
{
  "serverPort": 3000,
  "serialPort": "/dev/ttyUSB0",
  "MaxRecentActivity": 100,
  "topic": "house/x10",
  "mqttServerUrl": "tcp://X.X.X.X:1883"
}
</PRE>

# Installation

Either run npm install micro-app-mqtt-x10-bridge or clone this repository and then run npm install.  
Make sure you have installed both gcc-4.8 and g++-4.8 and they are the default compilers
as native compiles are required for the serialport module. 

# Running

To run the mqtt-x10-bridge app, add node.js to your path (currently requires 4.x or better) and
then run:

<PRE>
npm start
</PRE>

from the directory in which the micro-app-mqtt-x10-bridge was installed.

If you want to view the GUI. Point your browser at the host/port for the server
(or now use the micro-app-electron-launcher). 
If you have configured your browser to allow javascript to close the current page
the original window will be closed and one with the correct size of the
bridge GUI will be created.

Note that you don't need to connect or view the GUI, the bridge can simply run
in the background.


# Example

The following is the GUI for the bridge:

![picture of bridge display](https://raw.githubusercontent.com/mhdawson/micro-app-mqtt-x10-bridge/master/pictures/mqttx10bridge.jpg)

# Key Depdencies

## micro-app-framework
As a micro-app the onetime password app depends on the micro-app-framework:

* [micro-app-framework npm](https://www.npmjs.com/package/micro-app-framework)
* [micro-app-framework github](https://github.com/mhdawson/micro-app-framework)

See the documentation on the micro-app-framework for more information on general
configurtion options that are availble (ex using tls, authentication, serverPort, etc)

## other modules

* [serialport](https://www.npmjs.com/package/serialport)
* [node-x10-comm](https://www.npmjs.com/package/node-x10-comm)

# TODO
Add validation to GUI entry boxes to only allow the valid range for each entry box
