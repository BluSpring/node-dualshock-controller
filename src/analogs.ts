
// Module dependencies.

import dsutilities from './utilities';
import Smoothing from './smoothing';
import config from './config';
import Controller from './controller';
import { AnalogStick } from './interfaces';

//Proccess Analog stick events.
export default class Analogs {
    controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
    }

    private varianceThreshhold = 1;
    private smoothInput = config.getOptions().analogStickSmoothing;
    private outputSmoothing = new Smoothing(this.smoothInput);
    private analogSticks = config.getControllerConfig().analogSticks;

    //Private methods
    private processStick(analogStick: AnalogStick, data) {
        var currentValue = {
                x: data[analogStick.x],
                y: data[analogStick.y]
            },
            previousValue = {
                x: this.outputSmoothing.readLastPosition(analogStick.name + 'x'),
                y: this.outputSmoothing.readLastPosition(analogStick.name + 'y')
            };

        //we only raise an event if both
        if (dsutilities.isWithinVariance(previousValue.x, currentValue.x, this.varianceThreshhold) ||
            dsutilities.isWithinVariance(previousValue.y, currentValue.y, this.varianceThreshhold)) {

            currentValue.x = this.outputSmoothing.smooth(analogStick.name + 'x', currentValue.x);
            currentValue.y = this.outputSmoothing.smooth(analogStick.name + 'y', currentValue.y);

            // Update and emit
            if (this.controller[analogStick.name]) {
                this.controller[analogStick.name].x = currentValue.x;
                this.controller[analogStick.name].y = currentValue.y;
            }
            this.controller.emit(analogStick.name + ':move', currentValue);
        }
    };

    // Public methods
    //process all the analog events.
    process(data) {
        for (var i = 0; i < this.analogSticks.length; i++) {
            this.processStick(this.analogSticks[i], data);
        }
    };
};