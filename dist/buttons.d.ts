import Controller from './controller';
export default class Buttons {
    controller: Controller;
    buttons: import("./interfaces").Button[];
    constructor(controller: Controller);
    buffer: {};
    private emitEvent;
    private processButton;
    process(data: any): void;
}
