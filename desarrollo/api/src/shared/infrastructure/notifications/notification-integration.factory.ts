import { PrismaClient } from '@prisma/client';
import { getApplicationEventDispatcher } from '../../../shared/infrastructure/events/application-event-dispatcher';
import { NotificationIntegrationService } from '../../../features/notificaciones/application/services/notification-integration.service';

let integrationService: NotificationIntegrationService | null = null;

export function getNotificationIntegrationService(prisma: PrismaClient): NotificationIntegrationService {
  if (!integrationService) {
    integrationService = new NotificationIntegrationService(prisma, getApplicationEventDispatcher());
  }
  return integrationService;
}

export function resetNotificationIntegrationServiceForTests(): void {
  integrationService = null;
}
