"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationIntegrationService = getNotificationIntegrationService;
exports.resetNotificationIntegrationServiceForTests = resetNotificationIntegrationServiceForTests;
const application_event_dispatcher_1 = require("../../../shared/infrastructure/events/application-event-dispatcher");
const notification_integration_service_1 = require("../../../features/notificaciones/application/services/notification-integration.service");
let integrationService = null;
function getNotificationIntegrationService(prisma) {
    if (!integrationService) {
        integrationService = new notification_integration_service_1.NotificationIntegrationService(prisma, (0, application_event_dispatcher_1.getApplicationEventDispatcher)());
    }
    return integrationService;
}
function resetNotificationIntegrationServiceForTests() {
    integrationService = null;
}
//# sourceMappingURL=notification-integration.factory.js.map