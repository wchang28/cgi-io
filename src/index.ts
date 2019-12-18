import {IOTemplate} from "io-stream-templates";
import {Readable, Writable, PassThrough} from "stream";
import {spawn} from "child_process";

export class IO extends IOTemplate {
    constructor(spawnArgsSource: () => {command: string, args?: string[], cwd?: string, env?: any}) {
        super(() => {
            const {command, args, cwd, env} = spawnArgsSource();
            const cp = spawn(command, args, {cwd, env, windowsHide: true});
            const ps = new PassThrough();
            cp.stderr.on("data", (chunk: any) => {
                ps.write(chunk);
            });
            cp.stdout.on("data", (chunk: any) => {
                ps.write(chunk);
            });
            cp.on("error", (err: any) => {
                ps.emit("error", err);
            }).on("close", (code: number, signal) => {
                ps.emit("child-process-close", code, signal);
                ps.end();
            });
            return {writable: cp.stdin as Writable, readable: ps as Readable};            
        });

        this.internalReadable.on("child-process-close", (code, signal) => {
            this.emit("child-process-close", code, signal);
        });
    }
}