"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeEnv = void 0;
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const path_1 = require("path");
const nodeEnv = process.env.NODE_ENV ?? 'development';
function loadEnvFile(filename, override) {
    const filePath = (0, path_1.resolve)(process.cwd(), filename);
    if ((0, fs_1.existsSync)(filePath)) {
        (0, dotenv_1.config)({ path: filePath, override });
    }
}
loadEnvFile('.env', false);
loadEnvFile('.env.local', true);
loadEnvFile(`.env.${nodeEnv}`, true);
loadEnvFile(`.env.${nodeEnv}.local`, true);
exports.runtimeEnv = nodeEnv;
//# sourceMappingURL=load-env.js.map