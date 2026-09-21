export interface SyncCursorOptions {
  activosOnly?: boolean;
  since?: Date;
}

export const SNAPSHOT_HISTORY_DAYS = 90;

export function snapshotSinceDate(days = SNAPSHOT_HISTORY_DAYS): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
