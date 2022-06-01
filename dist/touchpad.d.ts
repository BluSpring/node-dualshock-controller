import Controller from './controller';
export default class TouchPad {
    controller: Controller;
    constructor(controller: Controller);
    private readonly touchPad;
    private pBuffer;
    private processIsActive;
    private processData;
    process(buffer: any): void;
}
