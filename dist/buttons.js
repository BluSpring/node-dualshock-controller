'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
const utilities_1 = __importDefault(require("./utilities"));
const config_1 = __importDefault(require("./config"));
//Proccess button events.
class Buttons {
    controller;
    buttons = config_1.default.getControllerConfig().buttons;
    constructor(controller) {
        this.controller = controller;
        // convert strings to numbers, e.g. "0x01" to 0x01
        // must be converted because JSON doesn't allow numbers with leading zeros
        this.buttons.forEach(function (button) {
            if (typeof button.buttonValue == "string") {
                button.buttonValue = parseInt(button.buttonValue);
            }
            if (typeof button.mask == "string") {
                button.mask = parseInt(button.mask);
            }
            else if (!button.mask) {
                button.mask = 0xFF;
            }
            //generate event name aliases: 
            button.eventPrefixes = utilities_1.default.generateEventPrefixAliases(button.name);
        });
    }
    buffer = {};
    //Private methods
    emitEvent(button, eventText, data) {
        button.eventPrefixes.forEach(function (eventPrefix) {
            this.controller.emit(eventPrefix + eventText, data);
        });
    }
    ;
    processButton(button, data) {
        //make sure the data contains a value for the specified block
        //and bitwise operation for the button value
        var block = data[button.buttonBlock] & button.mask;
        var hit = (block & button.buttonValue) == button.buttonValue;
        var value = 0;
        var state = 0; // 0: up, 1: down, 2: hold
        // special case for the dualshock 4's dpadUp button as it causes the
        // lower 8 bits of it's block to be zeroed
        if (!button.buttonValue) {
            hit = !block;
        }
        // special case for dualshock 4's dpad - they are not bitmasked values as
        // they cannot be pressed together - ie. up, left and upleft are three
        // different values - upleft is not equal to up & left
        if (button.buttonBlock == 5 && block < 0x08) {
            hit = block == button.buttonValue;
        }
        if (hit) {
            value = 1;
            //if the button is in the released state.
            if (!this.buffer[button.name]) {
                state = 1;
                this.buffer[button.name] = true;
                this.emitEvent(button, ':press', button.name);
            }
            else {
                state = 2;
                this.emitEvent(button, ':hold', button.name);
            }
            //send the analog data
            if (button.analogPin && data[button.analogPin]) {
                this.emitEvent(button, ':analog', data[button.analogPin]);
            }
        }
        else if (this.buffer[button.name]) {
            //button was pressed and is not released
            this.buffer[button.name] = false;
            //button is no longer pressed, emit a analog 0 event.
            if (button.analogPin) {
                this.emitEvent(button, ':analog', 0);
            }
            //emit the released event.
            this.emitEvent(button, ':release', button.name);
        }
        if (this.controller[button.name]) {
            this.controller[button.name].value = value;
            this.controller[button.name].state = state;
        }
    }
    ;
    // Public methods
    //process all the analog events.
    process(data) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.processButton(this.buttons[i], data);
        }
    }
    ;
}
exports.default = Buttons;
;
module.exports = Buttons;
