'use strict';
// Module dependencies.
import dsutilities from './utilities';
import Smoothing from './smoothing';
import config from './config';
import Controller from './controller';
import { MotionInput } from './interfaces';

//Proccess button events.
export default class MotionProcessor {
    controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;

        //generate event name aliases:
        this.motionInputs.forEach(function(motionAxis) {
            motionAxis.eventPrefixes = dsutilities.generateEventPrefixAliases(motionAxis.name);
        });
    }

    varianceThreshhold = 1;
    smoothInput = config.getOptions().accelerometerSmoothing;
    outputSmoothing = new Smoothing(this.smoothInput);
    motionInputs = config.getControllerConfig().motionInputs;

    //Private methods
    //data corrections so that each dirrection has a 0 throug x value
    private correctData(motionAxis: MotionInput, data) {
        let value: number;
        //ensuring that both directions start from 0 and move to -x or x;
        if (data[motionAxis.directionPin] === 1) {
            //we need the values to be from 0 to x.
            value = 255 - data[motionAxis.valuePin];
        } else if (data[motionAxis.directionPin] === 2) {
            //going in the oposite direction, we need to values to be from 0 to -x;
            value = data[motionAxis.valuePin] * -1;
        } else {
            value = 0;
        }

        //return an object with both value and dirrection.
        return {
            direction: data[motionAxis.directionPin],
            value: value
        };
    };

    //process the axis movement.
    private processAxis(motionAxis: MotionInput, data) {
        //every motion will have a dirrection and a value
        var motionValue = this.correctData(motionAxis, data),
            lastPosition = this.outputSmoothing.readLastPosition(motionAxis.name);

        //check if the values are within variance
        if (dsutilities.isWithinVariance(lastPosition, motionValue.value, this.varianceThreshhold)) {
            motionValue.value = this.outputSmoothing.smooth(motionAxis.name, motionValue.value);

            // Don't assign motionValue directly to controller[motionAxis.name],
            // this will break the reference.
            if (this.controller[motionAxis.name]) {
                this.controller[motionAxis.name].value = motionValue.value;
                this.controller[motionAxis.name].direction = motionValue.direction;
            }

            motionAxis.eventPrefixes?.forEach(function(eventPrefix) {
                this.controller.emit(eventPrefix + ':motion', motionValue);
            });
        }
    };

    // Public methods
    //process all configured motion inputs.
    process(data) {
        for (var i = 0; i < this.motionInputs.length; i++) {
            this.processAxis(this.motionInputs[i], data);
        }
    };
};