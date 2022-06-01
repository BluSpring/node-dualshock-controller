export default class Smoothing {
    smoothInput: boolean;
    constructor(smoothInput: any);
    buffer: {};
    maxFrames: number;
    readLastPosition(motionAxisName: string): any;
    addToBuffer(motionAxisName: string, value: number): void;
    smooth(motionAxisName: string, value: number): number;
}
