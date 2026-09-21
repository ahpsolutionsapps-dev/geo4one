import { createHash, randomInt } from 'crypto';

const CODE_TTL_MS = 10 * 60 * 1000;

interface PasswordResetEntry {
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

function hashCode(email: string, code: string): string {
  return createHash('sha256')
    .update(`${email.trim().toLowerCase()}:${code}`)
    .digest('hex');
}

export class PasswordResetCodeStore {
  private readonly entries = new Map<string, PasswordResetEntry>();

  create(email: string): { code: string; expiresAt: Date } {
    const normalizedEmail = email.trim().toLowerCase();
    const code = String(randomInt(100000, 1000000));
    const expiresAt = Date.now() + CODE_TTL_MS;

    this.entries.set(normalizedEmail, {
      email: normalizedEmail,
      codeHash: hashCode(normalizedEmail, code),
      expiresAt,
      attempts: 0,
    });

    return { code, expiresAt: new Date(expiresAt) };
  }

  consume(email: string, code: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = this.entries.get(normalizedEmail);
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.entries.delete(normalizedEmail);
      return false;
    }

    entry.attempts += 1;
    if (entry.attempts > 5) {
      this.entries.delete(normalizedEmail);
      return false;
    }

    const ok = entry.codeHash === hashCode(normalizedEmail, code.trim());
    if (ok) {
      this.entries.delete(normalizedEmail);
    }
    return ok;
  }

  invalidate(email: string): void {
    this.entries.delete(email.trim().toLowerCase());
  }
}

export const passwordResetCodeStore = new PasswordResetCodeStore();
