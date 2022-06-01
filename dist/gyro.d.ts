import Smoothing from './smoothing';
import Controller from './controller';
import { MotionInput } from './interfaces';
export default class MotionProcessor {
    controller: Controller;
    constructor(controller: Controller);
    varianceThreshhold: number;
    smoothInput: boolean;
    outputSmoothing: Smoothing;
    motionInputs: MotionInput[];
    private correctData;
    private processAxis;
    process(data: any): void;
}
