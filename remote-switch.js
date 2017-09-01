/**
 * Created by prawda on 12.01.2015.
 */

exports.switchOn = switchOn
exports.switchOff = switchOff
exports.disconnect = disconnect

// UIDs:
var humidityUID = 'ujb';
var temperatureUID = 'qvY';
var remoteUID = 'uYH';
// house 31, 27

var Tinkerforge = require('tinkerforge');

var HOST = 'localhost';
var PORT = 4223;
var UID = remoteUID; // Change XYZ to the UID of your Remote Switch Bricklet
var connected = false;

var ipcon = new Tinkerforge.IPConnection(); // Create IP connection
var rs = new Tinkerforge.BrickletRemoteSwitch(UID, ipcon); // Create device object

ipcon.connect(HOST, PORT,
    function (error) {
        console.log('Error: ' + error);
    }
); // Connect to brickd
// Don't use device before ipcon is connected

ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function (connectReason) {
        connected = true;

        // Switch on a type A socket with house code 17 and receiver code 1.
        // House code 17 is 10001 in binary (least-significant bit first)
        // and means that the DIP switches 1 and 5 are on and 2-4 are off.
        // Receiver code 1 is 10000 in binary (least-significant bit first)
        // and means that the DIP switch A is on and B-E are off.
        var houseCode = 31;
        var itemCode = 2;
        //rs.switchSocketA(houseCode, itemCode, Tinkerforge.BrickletRemoteSwitch.SWITCH_TO_OFF);
        
    }
);

function flipflop(houseCode, itemCode) {
    switchRemote(houseCode, itemCode, Tinkerforge.BrickletRemoteSwitch.SWITCH_TO_OFF);
    setTimeout(function() {
        switchRemote(houseCode, itemCode, Tinkerforge.BrickletRemoteSwitch.SWITCH_TO_ON);
    }, 500);
}

function switchOn(houseCode, itemCode) {
    switchRemote(houseCode, itemCode, Tinkerforge.BrickletRemoteSwitch.SWITCH_TO_ON);
}

function switchOff(houseCode, itemCode) {
    switchRemote(houseCode, itemCode, Tinkerforge.BrickletRemoteSwitch.SWITCH_TO_OFF)
}

function switchRemote(houseCode, itemCode, state) {
    if(connected) {
        rs.switchSocketA(houseCode, itemCode, state);
        console.log("switch "+state+" emitted for item "+itemCode+" and house code "+houseCode);
    }
    else {
        console.log("not connected - cannot switch");
    }
}        

function disconnect() {
    connected = false;
    ipcon.disconnect();
}

