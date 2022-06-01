"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = __importDefault(require("./controller"));
const config_1 = __importDefault(require("./config"));
// Module dependencies.
// This is the app entry point.
//  options you can pass:
//  {
//   config : "File from controllerConfigurations" or a JS object containing configuration,
//   accelerometerSmoothing : true/false, this will activate motion/acelerometer output smoothing. true by default.
//   analogStickSmoothing : true/false, this will activate analog thumb stick smoothing
//  }
function default_1(options) {
    //set the current options
    config_1.default.setOptions(options);
    //returns the controller.
    return new controller_1.default();
}
exports.default = default_1;
;
