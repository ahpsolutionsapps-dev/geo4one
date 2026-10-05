"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationIntegrationService = void 0;
class NotificationIntegrationService {
    prisma;
    dispatcher;
    constructor(prisma, dispatcher) {
        this.prisma = prisma;
        this.dispatcher = dispatcher;
    }
    async notifyStockThresholds() {
        void this.prisma;
        void this.dispatcher;
    }
}
exports.NotificationIntegrationService = NotificationIntegrationService;
//# sourceMappingURL=notification-integration.service.js.map