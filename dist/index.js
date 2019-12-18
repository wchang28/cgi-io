"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var io_stream_templates_1 = require("io-stream-templates");
var stream_1 = require("stream");
var child_process_1 = require("child_process");
var IO = /** @class */ (function (_super) {
    __extends(IO, _super);
    function IO(spawnArgsSource) {
        var _this = _super.call(this, function () {
            var _a = spawnArgsSource(), command = _a.command, args = _a.args, cwd = _a.cwd, env = _a.env;
            var cp = child_process_1.spawn(command, args, { cwd: cwd, env: env, windowsHide: true });
            var ps = new stream_1.PassThrough();
            cp.stderr.on("data", function (chunk) {
                ps.write(chunk);
            });
            cp.stdout.on("data", function (chunk) {
                ps.write(chunk);
            });
            cp.on("error", function (err) {
                ps.emit("error", err);
            }).on("close", function (code, signal) {
                ps.emit("child-process-close", code, signal);
                ps.end();
            });
            return { writable: cp.stdin, readable: ps };
        }) || this;
        _this.internalReadable.on("child-process-close", function (code, signal) {
            _this.emit("child-process-close", code, signal);
        });
        return _this;
    }
    return IO;
}(io_stream_templates_1.IOTemplate));
exports.IO = IO;
//# sourceMappingURL=index.js.map