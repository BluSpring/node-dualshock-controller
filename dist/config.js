'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
// we will expose these objects via the manager.
//provides access to the current options and configs.
class Config {
    static options;
    static controllerConfig;
    static setOptions(opts) {
        //no options were passed
        this.options = opts || {};
        // Defaults:
        var defaultValues = {
            config: "dualShock3",
            accelerometerSmoothing: true,
            analogStickSmoothing: false,
            logging: false,
            forceNodeHid: false,
            linuxJoystickId: 0
        };
        for (var name in defaultValues) {
            if (defaultValues.hasOwnProperty(name)) {
                var target = this.options[name];
                var orig = defaultValues[name];
                if (!target) {
                    this.options[name] = orig;
                }
            }
        }
        let controllerConfiguration;
        //use passed config or load from built-in configs
        if (typeof this.options.config === "object") {
            controllerConfiguration = this.options.config;
        }
        else {
            controllerConfiguration = require('./../controllerConfigurations/' + this.options.config);
        }
        //set the current controllerConfiguration
        Config.setControllerConfig(controllerConfiguration);
    }
    static getOptions() {
        return this.options;
    }
    static setControllerConfig(config) {
        this.controllerConfig = config;
    }
    static getControllerConfig() {
        return this.controllerConfig;
    }
}
exports.default = Config;
;
