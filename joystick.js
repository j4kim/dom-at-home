var HID = require('node-hid')
var robot = require('robotjs');

console.log(HID.devices())

/*
{
    vendorId: 121, // 0x79
    productId: 6,
    path: 'IOService:/AppleARMPE/arm-io@10F00000/AppleT810xIO/usb-drd1@2280000/AppleT8103USBXHCI@01000000/usb-drd1-port-hs@01100000/Generic   USB  Joystick  @01100000/IOUSBHostInterface@0/AppleUserUSBHostHIDDevice',
    serialNumber: '',
    manufacturer: 'DragonRise Inc.  ',
    product: 'Generic   USB  Joystick  ',
    release: 263,
    interface: 0,
    usagePage: 1,
    usage: 4
}
*/
var device = new HID.HID(121, 6)

var state = {
    joystick: undefined,
    button: undefined
}

const joystickBindings = {
    "0,127": "left",
    "127,0": "up",
    "255,127": "right",
    "127,255": "down"  
}

device.on("data", function(data) {
    var joystickData = data.slice(0, 2).join()
    if (joystickData !== state.joystick) {
        state.joystick = joystickData
        let key = joystickBindings[joystickData]
        if (key) {
            robot.keyTap(key)
        }
    }
    var buttonData = data.slice(5, 6).join()
    if (buttonData !== state.button) {
        state.button = buttonData
        if (buttonData == 31) {
            robot.keyTap("space")  
        }
    }
});