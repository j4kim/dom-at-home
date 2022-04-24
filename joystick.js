const HID = require('node-hid')
const robot = require('robotjs')

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

try {
    var device = new HID.HID(121, 6)
} catch (error) {
    console.error("Joystick device not found")
    process.exit()
}

var state = {
    joystick: undefined,
    button: undefined,
    money: undefined
}

const logMode = process.argv[2] === 'log'

const joystickBindings = {
    "0,127": "left",
    "127,0": "up",
    "255,127": "right",
    "127,255": "down"  
}

function log(...args) {
    if (logMode) {
        console.log(...args)
    }
}

device.on("data", function(data) {
    var joystickData = data.slice(0, 2).join()
    if (joystickData !== state.joystick) {
        log({ joystickData })
        state.joystick = joystickData
        let key = joystickBindings[joystickData]
        if (!logMode && key) {
            robot.keyTap(key)
        }
    }
    var buttonData = data.slice(5, 6).join()
    if (buttonData !== state.button) {
        log({ buttonData })
        state.button = buttonData
        if (!logMode && buttonData == 31) {
            robot.keyTap("space")  
        }
    }
    var moneyData = data.slice(6, 7).join()
    if (moneyData !== state.money) {
        log({ moneyData })
        state.money = moneyData
        if (!logMode && moneyData == 128) {
            robot.keyTap("enter")
        }
    }
});