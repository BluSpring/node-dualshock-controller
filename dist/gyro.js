'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
const utilities_1 = __importDefault(require("./utilities"));
const smoothing_1 = __importDefault(require("./smoothing"));
const config_1 = __importDefault(require("./config"));
//Proccess button events.
class MotionProcessor {
    controller;
    constructor(controller) {
        this.controller = controller;
        //generate event name aliases:
        this.motionInputs.forEach(function (motionAxis) {
            motionAxis.eventPrefixes = utilities_1.default.generateEventPrefixAliases(motionAxis.name);
        });
    }
    varianceThreshhold = 1;
    smoothInput = config_1.default.getOptions().accelerometerSmoothing;
    outputSmoothing = new smoothing_1.default(this.smoothInput);
    motionInputs = config_1.default.getControllerConfig().motionInputs;
    //Private methods
    //data corrections so that each dirrection has a 0 throug x value
    correctData(motionAxis, data) {
        let value;
        //ensuring that both directions start from 0 and move to -x or x;
        if (data[motionAxis.directionPin] === 1) {
            //we need the values to be from 0 to x.
            value = 255 - data[motionAxis.valuePin];
        }
        else if (data[motionAxis.directionPin] === 2) {
            //going in the oposite direction, we need to values to be from 0 to -x;
            value = data[motionAxis.valuePin] * -1;
        }
        else {
            value = 0;
        }
        //return an object with both value and dirrection.
        return {
            direction: data[motionAxis.directionPin],
            value: value
        };
    }
    ;
    //process the axis movement.
    processAxis(motionAxis, data) {
        //every motion will have a dirrection and a value
        var motionValue = this.correctData(motionAxis, data), lastPosition = this.outputSmoothing.readLastPosition(motionAxis.name);
        //check if the values are within variance
        if (utilities_1.default.isWithinVariance(lastPosition, motionValue.value, this.varianceThreshhold)) {
            motionValue.value = this.outputSmoothing.smooth(motionAxis.name, motionValue.value);
            // Don't assign motionValue directly to controller[motionAxis.name],
            // this will break the reference.
            if (this.controller[motionAxis.name]) {
                this.controller[motionAxis.name].value = motionValue.value;
                this.controller[motionAxis.name].direction = motionValue.direction;
            }
            motionAxis.eventPrefixes?.forEach(function (eventPrefix) {
                this.controller.emit(eventPrefix + ':motion', motionValue);
            });
        }
    }
    ;
    // Public methods
    //process all configured motion inputs.
    process(data) {
        for (var i = 0; i < this.motionInputs.length; i++) {
            this.processAxis(this.motionInputs[i], data);
        }
    }
    ;
}
exports.default = MotionProcessor;
;
