"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./infrastructure/security/logger");
async function bootstrap() {
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.port, () => {
        logger_1.logger.info(`Upload Service [${env_1.env.nodeEnv}] escuchando en ${env_1.env.publicUrl}`);
    });
}
bootstrap().catch((error) => {
    logger_1.logger.error('Error al iniciar el servidor', { error });
    process.exit(1);
});
//# sourceMappingURL=server.js.map