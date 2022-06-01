'use strict';
// Module dependencies.

import config from './config';
import Controller from './controller';

//Proccess button events.
export default class Status {
    controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
    }

    buffer = {};
    status = config.getControllerConfig().status;

    private processControllerStatus(category, data) {
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
    };

    process(data) {
        for (var i = 0; i < status.length; i++) {
            this.processControllerStatus(status[i], data);
        }
    };
};