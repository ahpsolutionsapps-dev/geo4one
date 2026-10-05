import { PrismaClient } from '@prisma/client';

import { ApplicationEventDispatcher } from '../../../../shared/infrastructure/events/application-event-dispatcher';

export class NotificationIntegrationService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly dispatcher: ApplicationEventDispatcher,
  ) {}

  async notifyStockThresholds(): Promise<void> {
    void this.prisma;
    void this.dispatcher;
  }
}