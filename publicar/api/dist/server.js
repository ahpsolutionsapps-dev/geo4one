"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
require("./core/config/load-env");
const app_1 = require("./app");
const env_1 = require("./core/config/env");
const websocket_server_1 = require("./core/websocket/websocket-server");
//import { startNotificationScheduler } from './features/notificaciones/presentation/notificaciones.routes';
const app = (0, app_1.createApp)();
const server = node_http_1.default.createServer(app);
(0, websocket_server_1.attachWebSocketServer)(server);
//startNotificationScheduler();
server.listen(env_1.env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API [${env_1.env.nodeEnv}] escuchando en http://localhost:${env_1.env.port}`);
    // eslint-disable-next-line no-console
    console.log(`WebSocket disponible en ws://localhost:${env_1.env.port}/ws`);
});
//# sourceMappingURL=server.js.map