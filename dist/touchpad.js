"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
function genpBufferFromConf(tpAxis) {
    return {
        name: tpAxis.name,
        active: false,
        data: {
            x: 0,
            y: 0
        }
    };
}
class TouchPad {
    controller;
    constructor(controller) {
        this.controller = controller;
    }
    touchPad = config_1.default.getControllerConfig().touchPad;
    pBuffer = {};
    processIsActive(buffer, tpAxis) {
        const active = buffer[tpAxis.activePin] < 128;
        const axisBuffer = this.pBuffer[tpAxis.name];
        const evt = active ? 'active' : 'inactive';
        if (active !== axisBuffer.active) {
            this.controller.emit(`touchpad:${tpAxis.name}:${evt}`);
        }
        axisBuffer.active = active;
    }
    processData(buffer, tpAxis) {
        const axisBuffer = this.pBuffer[tpAxis.name];
        if (axisBuffer.active) {
            axisBuffer.data.x = ((buffer[tpAxis.dataPinA] & 15) << 8 | buffer[tpAxis.dataPinB]);
            axisBuffer.data.y = buffer[tpAxis.dataPinC] << 4 | ((buffer[tpAxis.dataPinA] & 240) >> 4);
            this.controller.emit(`touchpad:${tpAxis.name}`, axisBuffer.data);
        }
    }
    process(buffer) {
        if (!this.touchPad)
            return;
        for (let i = 0; i < this.touchPad.length; i++) {
            //if we have not built a pBuffer profile for this axis lets build it.
            if (!this.pBuffer[this.touchPad[i].name]) {
                this.pBuffer[this.touchPad[i].name] = genpBufferFromConf(this.touchPad[i]);
            }
            this.processIsActive(buffer, this.touchPad[i]);
            this.processData(buffer, this.touchPad[i]);
        }
    }
    ;
}
exports.default = TouchPad;
;
