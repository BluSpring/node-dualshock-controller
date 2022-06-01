"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
const events_1 = require("events");
const utilities_1 = __importDefault(require("./utilities"));
const gyro_1 = __importDefault(require("./gyro"));
const analogs_1 = __importDefault(require("./analogs"));
const buttons_1 = __importDefault(require("./buttons"));
const status_1 = __importDefault(require("./status"));
const node_hid_1 = __importDefault(require("node-hid"));
const config_1 = __importDefault(require("./config"));
const touchpad_1 = __importDefault(require("./touchpad"));
//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
class Controller extends events_1.EventEmitter {
    controllerConfig = config_1.default.getControllerConfig();
    options = config_1.default.getOptions();
    indexes = this.controllerConfig.output.indexes;
    analogs = new analogs_1.default(this);
    buttons = new buttons_1.default(this);
    gyro = new gyro_1.default(this);
    status = new status_1.default(this);
    touchPad = new touchpad_1.default(this);
    device;
    constructor() {
        super();
        [{
                type: 'analogSticks',
                properties: [{
                        name: 'x',
                        initialValue: 0
                    }, {
                        name: 'y',
                        initialValue: 0
                    }]
            }, {
                type: 'buttons',
                properties: [{
                        name: 'state',
                        initialValue: 0
                    }, {
                        name: 'value',
                        initialValue: 0
                    }]
            }, {
                type: 'motionInputs',
                properties: [{
                        name: 'value',
                        initialValue: 0
                    }, {
                        name: 'direction',
                        initialValue: 0
                    }]
            }, {
                type: 'status',
                properties: [{
                        name: 'state',
                        initialValue: ''
                    }]
            }].forEach(function (setup) {
            const entities = this.controllerConfig[setup.type], properties = setup.properties;
            if (entities.length) {
                entities.forEach(function (entity) {
                    this[entity.name] = properties.reduce((accum, property) => {
                        return (accum[property.name] = property.initialValue, accum);
                    }, {});
                }, this);
            }
        }, this);
        //connect to the controller.
        if (typeof this.options.device === 'undefined') {
            utilities_1.default.warn('node dualshock connecting');
            const deviceMeta = node_hid_1.default.devices()
                .filter(this.isController)[0];
            if (deviceMeta && deviceMeta.path) {
                this.device = new node_hid_1.default.HID(deviceMeta.path);
            }
            else {
                this.handleException(new Error(`device with VID:${this.controllerConfig.vendorId} PID:${this.controllerConfig.productId} not found`));
            }
        }
        else {
            // Allow user-specified device
            this.device = this.options.device;
        }
        this.device?.on('data', this.processFrame.bind(this));
        this.device?.on('error', this.handleException.bind(this));
        //subscribe to the exit event:
        process.on('exit', this.disconnect.bind(this));
    }
    //Private methods
    //emit an error event or log it to the console.
    handleException(ex) {
        //if exception was generated within our stream
        if (this && this.emit) {
            this.emit('error', ex);
        }
        else {
            utilities_1.default.warn(ex);
            throw (ex);
        }
    }
    ;
    //process data from HID connected device.
    processFrame(data) {
        if (this.controllerConfig.motionInputs) {
            this.gyro.process(data);
        }
        if (this.controllerConfig.analogSticks) {
            this.analogs.process(data);
        }
        if (this.controllerConfig.buttons) {
            this.buttons.process(data);
        }
        if (this.controllerConfig.status) {
            this.status.process(data);
        }
        if (this.controllerConfig.touchPad) {
            this.touchPad.process(data);
        }
    }
    ;
    isController(device) {
        var vendor = (device.vendorId == this.controllerConfig.vendorId);
        var product = (device.productId == this.controllerConfig.productId || device.productId == 2508);
        return vendor && product;
    }
    ;
    // Public methods
    connect() {
        utilities_1.default.warn('connect method is deprecated, controller now connects upon declaration.');
    }
    ;
    disconnect() {
        if (this.device && this.device.close) {
            this.device.close();
        }
        this.emit('disconnecting');
        utilities_1.default.warn('node dualshock disconnecting');
    }
    ;
    // Used to set controller rumble and light
    setExtras(data) {
        let buff = this.controllerConfig.output.defaultBuffer.slice();
        Object.keys(data).forEach(k => {
            buff[this.indexes[k]] = data[k];
        });
        this.device?.write(buff);
    }
    ;
}
exports.default = Controller;
;
