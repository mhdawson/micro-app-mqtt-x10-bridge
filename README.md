# micro-app-alert-dashboard - MQTT/Node base home alert dashsboard

Micro app to display a home alerts dashboard showing red/yellow/green
status for sensors, along with notification through sms after a given
delay once a sensor is triggered and not reset.

The dashboards listens on a number of mqtt topics for updates and then
forwards the updates to clients using socket.io.  It provides a simple way
to monitor sensors and generate an sms notification through twilio once
a sensor is triggered

I use it to make sure the garage door is not left open and that the
water heater and dishwasher are not leaking.

This is an example display:

![picture of dashboard main window](https://raw.githubusercontent.com/mhdawson/micro-app-alert-dashboard/master/pictures/homeAlertDashboard.jpg?raw=true)

The following is the sensor I used to monitor for water leaks:

![water sensor](https://raw.githubusercontent.com/mhdawson/micro-app-alert-dashboard/master/pictures/watersensor.jpg?raw=true)

which is available from ebay here: (ebay listing)[http://www.ebay.ca/itm/4pcs-Wireless-Water-Intrusion-Leakage-Sensor-Water-leak-433MHz-For-Alarm-System-/191732541917?hash=item2ca42669dd] 

For the garage door I used a custom arduino based sensor as none of the
avialable sensors provided both an open and close notification.  I'll add
a link to the project for this sensor once I add it to github


The following projects can be used to connect the required sensors

* [PI433WirelessRecvMananager](https://github.com/mhdawson/PI433WirelessRecvManager)

# Usage

After installation modify ../lib/config.json to match your configuration

The configuration entries that must be updated include:

* mqttServerUrl - url of the mqtt server to connect to.  This can either start
  with tcp:// or mqtts://. If it starts with mqtts://  there must be a subdirectory
  in the lib directory called mqttclient which contains ca.cert, client.cert,
  client.key which contain the key and associated certificates for a client
  which is authorized to connect to the mqtt server.
* dashboardEntries - array in which each entry  which contain an id, name,
  alertTopic, resetTopic and delay.  The id must be a unique value, the
  name name is what will be displayed as the label in the dashboard. The alertTopic
  is the topic which indicates the entry should be alerted, while the resetTopic
  is the topic which indicates the entry should be reset(optional).
  The delay (optional) is the time between when the entry is alerted and when the
  status for the entry will be set to alerted and notifications sent out.  The
  entry will be shown as "yellow" in the dashboard during this time. The value
  pubished to the topics does not matter, any message published to the topics
  will be used as the trigger
* twilio - twilio configuration data.  Object with fields for
  twilioAccountSID, twilioAccountAuthToken, twilioToNumber, twilioFromNumber
* serverPort - port on which the dashboard listens for connections
* title - title for the dashbaord paged (optional)

As a micro-app the dashboard also supports other options like authentication and
tls for the dashboard connection.  See the documentation for the micro-app-framework
for additional details.

The following is an example of the configuration file:

<PRE>
{
  "title": "House Alert Data",
  "serverPort": 3000,
  "mqttServerUrl": "your mqtt server",
  "dashboardEntries": [ { "id": "garagedoor", "name": "Garage Door", "alertTopic": "house/2262/350/0101FFFF0000", "resetTopic": "house/2262/350/0101FFFF0001", "delay": 300 },
                        { "id": "dishwasher", "name": "Dishwasher", "alertTopic": "house/2262/350/FFF0FFFF0001", "resetTopic": "", "delay": "0" },
                        { "id": "watertank", "name": "Water Tank", "alertTopic": "house/2262/350/FFF0FFFF0010", "resetTopic": "", "delay": "0" } ],
  "twilio": { "twilioAccountSID": "your value", "twilioAccountAuthToken": "your value", "twilioToNumber": "your value" , "twilioFromNumber": "your value" }
}
</PRE>

# Installation

Simply run npm install micro-app-alert-dashboard

# Running

To run the alert-dashboard app, add node.js to your path (currently requires 4.x or better) and
then run:

<PRE>
npm start
</PRE>

from the directory in the micro-app-alert-dashboard was installed.

Once the server is started. Point your browser at the host/port for the server.
If you have configured your browser to allow javascript to close the current page
the original window will be closed and one with the correct size of the
alert-dashboard app page will be created.


# Example

The following is the page shown for a sample configuration:

![picture of dashboard main window](https://raw.githubusercontent.com/mhdawson/micro-app-alert-dashboard/master/pictures/homeAlertDashboard.jpg?raw=true)

# Key Depdencies

## micro-app-framework
As a micro-app the onetime password app depends on the micro-app-framework:

* [micro-app-framework npm](https://www.npmjs.com/package/micro-app-framework)
* [micro-app-framework github](https://github.com/mhdawson/micro-app-framework)

See the documentation on the micro-app-framework for more information on general
configurtion options that are availble (ex using tls, authentication, serverPort, etc)

## twilio

[Twilio](https://www.twilio.com/)


# TODO
