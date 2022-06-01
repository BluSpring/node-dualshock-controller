import { HID } from "node-hid";
export interface AnalogStick {
    x: number;
    y: number;
    name: string;
    joystickXNumber?: number;
    joystickYNumber?: number;
}
export interface ConfigOptions {
    config: string | ControllerConfiguration;
    accelerometerSmoothing: boolean;
    analogStickSmoothing: boolean;
    logging: boolean;
    forceNodeHid: boolean;
    linuxJoystickId: number;
    device?: HID;
}
export interface Button {
    name: string;
    buttonBlock: number;
    buttonValue: number | string;
    analogPin?: number;
    joystickNumber?: number;
    mask?: number | string;
    eventPrefixes?: string[];
}
export interface MotionInput {
    name: string;
    directionPin: number;
    valuePin: number;
    eventPrefixes?: string[];
}
export interface ControllerStatusState {
    value: number;
    state: string;
}
export interface ControllerStatus {
    name: string;
    pin: number;
    states: ControllerStatusState[];
}
export interface ControllerOutputIndexes {
    rumbleLeft: number;
    rumbleRight: number;
    led?: number;
    red?: number;
    green?: number;
    blue?: number;
    flashOn?: number;
    flashOff?: number;
}
export interface ControllerOutput {
    defaultBuffer: number[];
    indexes: ControllerOutputIndexes;
}
export interface TouchPad {
    name: string;
    activePin: number;
    dataPinA: number;
    dataPinB: number;
    dataPinC: number;
}
export interface ControllerConfiguration {
    vendorId: number;
    productId: number;
    analogSticks: AnalogStick[];
    buttons: Button[];
    motionInputs: MotionInput[];
    status: ControllerStatus[];
    output: ControllerOutput;
    touchPad?: TouchPad[];
}
