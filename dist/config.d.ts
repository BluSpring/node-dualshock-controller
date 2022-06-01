import { ConfigOptions, ControllerConfiguration } from "./interfaces";
export default class Config {
    static options: ConfigOptions;
    static controllerConfig: ControllerConfiguration;
    static setOptions(opts: ConfigOptions): void;
    static getOptions(): ConfigOptions;
    static setControllerConfig(config: ControllerConfiguration): void;
    static getControllerConfig(): ControllerConfiguration;
}
