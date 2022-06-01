"use strict";
// Module dependencies.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importDefault(require("./utilities"));
const smoothing_1 = __importDefault(require("./smoothing"));
const config_1 = __importDefault(require("./config"));
//Proccess Analog stick events.
class Analogs {
    controller;
    constructor(controller) {
        this.controller = controller;
    }
    varianceThreshhold = 1;
    smoothInput = config_1.default.getOptions().analogStickSmoothing;
    outputSmoothing = new smoothing_1.default(this.smoothInput);
    analogSticks = config_1.default.getControllerConfig().analogSticks;
    //Private methods
    processStick(analogStick, data) {
        var currentValue = {
            x: data[analogStick.x],
            y: data[analogStick.y]
        }, previousValue = {
            x: this.outputSmoothing.readLastPosition(analogStick.name + 'x'),
            y: this.outputSmoothing.readLastPosition(analogStick.name + 'y')
        };
        //we only raise an event if both
        if (utilities_1.default.isWithinVariance(previousValue.x, currentValue.x, this.varianceThreshhold) ||
            utilities_1.default.isWithinVariance(previousValue.y, currentValue.y, this.varianceThreshhold)) {
            currentValue.x = this.outputSmoothing.smooth(analogStick.name + 'x', currentValue.x);
            currentValue.y = this.outputSmoothing.smooth(analogStick.name + 'y', currentValue.y);
            // Update and emit
            if (this.controller[analogStick.name]) {
                this.controller[analogStick.name].x = currentValue.x;
                this.controller[analogStick.name].y = currentValue.y;
            }
            this.controller.emit(analogStick.name + ':move', currentValue);
        }
    }
    ;
    // Public methods
    //process all the analog events.
    process(data) {
        for (var i = 0; i < this.analogSticks.length; i++) {
            this.processStick(this.analogSticks[i], data);
        }
    }
    ;
}
exports.default = Analogs;
;
