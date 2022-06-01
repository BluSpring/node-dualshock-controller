import Controller from './controller';
export default class Status {
    controller: Controller;
    constructor(controller: Controller);
    buffer: {};
    status: import("./interfaces").ControllerStatus[];
    private processControllerStatus;
    process(data: any): void;
}
