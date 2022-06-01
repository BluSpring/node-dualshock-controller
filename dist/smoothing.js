"use strict";
// Module dependencies.
Object.defineProperty(exports, "__esModule", { value: true });
//smooths data with moving average
class Smoothing {
    smoothInput;
    constructor(smoothInput) {
        this.smoothInput = smoothInput;
    }
    buffer = {};
    maxFrames = 5;
    // Public methods
    readLastPosition(motionAxisName) {
        var axisBuffer = this.buffer[motionAxisName];
        return axisBuffer ? axisBuffer[axisBuffer.length - 1] : null;
    }
    ;
    addToBuffer(motionAxisName, value) {
        if (this.buffer[motionAxisName]) {
            //add the current value to the buffer
            this.buffer[motionAxisName].push(value);
            //remove the head of the buffer
            if (this.buffer[motionAxisName].length > this.maxFrames) {
                this.buffer[motionAxisName].shift();
            }
        }
        else {
            //create an array with the value.
            this.buffer[motionAxisName] = [value];
        }
    }
    ;
    //smooth using a moving average.
    smooth(motionAxisName, value) {
        this.addToBuffer(motionAxisName, value);
        var axisBuffer = this.buffer[motionAxisName], sum = 0, smoothedVal = value;
        if (this.smoothInput) {
            for (var i = 0; i < axisBuffer.length; i++) {
                sum += axisBuffer[i];
            }
            smoothedVal = Math.floor(sum / axisBuffer.length);
        }
        return smoothedVal;
    }
    ;
}
exports.default = Smoothing;
;
