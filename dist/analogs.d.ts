import Controller from './controller';
export default class Analogs {
    controller: Controller;
    constructor(controller: Controller);
    private varianceThreshhold;
    private smoothInput;
    private outputSmoothing;
    private analogSticks;
    private processStick;
    process(data: any): void;
}
