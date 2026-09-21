import http from 'node:http';

import './core/config/load-env';
import { createApp } from './app';
import { env } from './core/config/env';
import { attachWebSocketServer } from './core/websocket/websocket-server';
//import { startNotificationScheduler } from './features/notificaciones/presentation/notificaciones.routes';

const app = createApp();
const server = http.createServer(app);

attachWebSocketServer(server);
//startNotificationScheduler();

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API [${env.nodeEnv}] escuchando en http://localhost:${env.port}`);
  // eslint-disable-next-line no-console
  console.log(`WebSocket disponible en ws://localhost:${env.port}/ws`);
});
