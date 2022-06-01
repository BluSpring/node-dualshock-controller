'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
const config_1 = __importDefault(require("./config"));
//Proccess button events.
class Status {
    controller;
    constructor(controller) {
        this.controller = controller;
    }
    buffer = {};
    status = config_1.default.getControllerConfig().status;
    processControllerStatus(category, data) {
        var state;
        for (var i = 0; i < category.states.length; i++) {
            if (data[category.pin] === category.states[i].value) {
                state = category.states[i].state;
            }
        }
        if (this.buffer[category.name] !== state) {
            if (this.controller[category.name]) {
                this.controller[category.name].state = state;
            }
            this.controller.emit(category.name + ':change', state);
        }
        this.buffer[category.name] = state;
    }
    ;
    process(data) {
        for (var i = 0; i < status.length; i++) {
            this.processControllerStatus(status[i], data);
        }
    }
    ;
}
exports.default = Status;
;
