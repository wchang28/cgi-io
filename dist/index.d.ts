import { IOTemplate } from "io-stream-templates";
export declare class IO extends IOTemplate {
    constructor(spawnArgsSource: () => {
        command: string;
        args?: string[];
        cwd?: string;
        env?: any;
    });
}
