var Tessel = require('tessel-io');
var five = require('johnny-five');
var Device = require('losant-mqtt').Device;

var device = new Device({
  id: 'my-device-id',
  key: 'my-access-key',
  secret: 'my-access-secret'
});

device.connect(function(err) {
  if(err) {
    console.log(err);
  }
  else {
    console.log('Connected to Losant!')
  }
});

device.on('error', function(err) {
  console.log(err);
});

var board = new five.Board({
  io: new Tessel()
});

board.on("ready", () => {
  var ambientSensor = new five.Multi({
    controller: 'BME280'
  });

  var lightSensor = new five.Light("a7");

  setInterval(function() {
    if(device.isConnected()) {
      device.sendState({
        tempF: ambientSensor.thermometer.fahrenheit,
        tempC: ambientSensor.thermometer.celsius,
        pressure: ambientSensor.barometer.pressure,
        humidity: ambientSensor.hygrometer.relativeHumidity,
        light: lightSensor.level
      });
    }
  }, 1000);

});
