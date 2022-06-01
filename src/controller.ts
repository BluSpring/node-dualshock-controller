// Module dependencies.
import { EventEmitter } from "events";
import util from 'util';
import dsutilities from './utilities';
import Gyro from './gyro';
import Analogs from './analogs';
import Buttons from './buttons';
import Status from './status';
import HID from 'node-hid';
import config from './config';
import TouchPad from './touchpad';

//generic controller object, it will need a controller Configuration with a buttons array passed into its connect function.
export default class Controller extends EventEmitter {
    controllerConfig = config.getControllerConfig();
    options = config.getOptions();
    indexes = this.controllerConfig.output.indexes;
    analogs = new Analogs(this);
    buttons = new Buttons(this);
    gyro = new Gyro(this);
    status = new Status(this);
    touchPad = new TouchPad(this);

    device?: HID.HID;

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
        }].forEach(function(setup) {
            const entities = this.controllerConfig[setup.type],
                properties: { name: string, initialValue: string | number }[] = setup.properties;

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
            dsutilities.warn('node dualshock connecting');

            const deviceMeta = HID.devices()
                .filter(this.isController)[0];
            if (deviceMeta && deviceMeta.path) {
                this.device = new HID.HID(deviceMeta.path);
            } else {
                this.handleException(new Error(`device with VID:${this.controllerConfig.vendorId} PID:${this.controllerConfig.productId} not found`));
            }

        } else {
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
    private handleException(ex: Error) {
        //if exception was generated within our stream
        if (this && this.emit) {
            this.emit('error', ex);
        } else {
            dsutilities.warn(ex);
            throw (ex);
        }
    };

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
    };

    isController(device: HID.Device) {
        var vendor = (device.vendorId == this.controllerConfig.vendorId);
        var product = (device.productId == this.controllerConfig.productId || device.productId == 2508);
        return vendor && product;
    };

    // Public methods
    connect() {
        dsutilities.warn('connect method is deprecated, controller now connects upon declaration.');
    };

    disconnect() {
        if (this.device && this.device.close) {
            this.device.close();
        }
        this.emit('disconnecting');
        dsutilities.warn('node dualshock disconnecting');
    };

    // Used to set controller rumble and light
    setExtras(data) {
        let buff = this.controllerConfig.output.defaultBuffer.slice();

        Object.keys(data).forEach(k => {
            buff[this.indexes[k]] = data[k];
        });
        this.device?.write(buff);
    };
};