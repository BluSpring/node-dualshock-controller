/// <reference types="node" />
import { EventEmitter } from "events";
import Gyro from './gyro';
import Analogs from './analogs';
import Buttons from './buttons';
import Status from './status';
import HID from 'node-hid';
import TouchPad from './touchpad';
export default class Controller extends EventEmitter {
    controllerConfig: import("./interfaces").ControllerConfiguration;
    options: import("./interfaces").ConfigOptions;
    indexes: import("./interfaces").ControllerOutputIndexes;
    analogs: Analogs;
    buttons: Buttons;
    gyro: Gyro;
    status: Status;
    touchPad: TouchPad;
    device?: HID.HID;
    constructor();
    private handleException;
    processFrame(data: any): void;
    isController(device: HID.Device): boolean;
    connect(): void;
    disconnect(): void;
    setExtras(data: any): void;
}
