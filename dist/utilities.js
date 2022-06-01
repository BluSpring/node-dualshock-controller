'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
const config_1 = __importDefault(require("./config"));
function unique(x) {
    var result = [];
    for (var i = 0; i < x.length; i++) {
        if ((result.indexOf(x[i]) < 0)) {
            result.push(x[i]);
        }
    }
    return result;
}
;
//provide a few utility functions.
exports.default = {
    //reduces noise from the controller
    isWithinVariance: function (x, y, varianceThreshhold) {
        return Math.abs(x - y) > varianceThreshhold;
    },
    warn: function (message) {
        if (config_1.default.getOptions().logging) {
            console.log(message);
        }
    },
    generateEventPrefixAliases: function (eventPrefix) {
        return unique([
            eventPrefix,
            eventPrefix.toLowerCase()
        ]);
    }
};
