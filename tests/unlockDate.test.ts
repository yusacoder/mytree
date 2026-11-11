import { describe, it, expect } from 'vitest';

function isMessageUnlocked(unlockDateString: string, currentDate = new Date()): boolean {
  const unlockDate = new Date(unlockDateString);
  return currentDate.getTime() >= unlockDate.getTime();
}

describe('Message Unlock Date Logic', () => {
  it('keeps messages locked before default date (2026-12-25)', () => {
    const defaultUnlock = '2026-12-25T00:00:00.000Z';
    const beforeDate = new Date('2026-12-24T23:59:59.000Z');
    expect(isMessageUnlocked(defaultUnlock, beforeDate)).toBe(false);
  });

  it('unlocks messages on or after 25 December 2026', () => {
    const defaultUnlock = '2026-12-25T00:00:00.000Z';
    const onDate = new Date('2026-12-25T00:00:00.000Z');
    const afterDate = new Date('2026-12-25T12:00:00.000Z');
    expect(isMessageUnlocked(defaultUnlock, onDate)).toBe(true);
    expect(isMessageUnlocked(defaultUnlock, afterDate)).toBe(true);
  });

  it('respects admin custom unlock date updates', () => {
    const customUnlock = '2026-01-01T00:00:00.000Z';
    const checkDate = new Date('2026-06-01T00:00:00.000Z');
    expect(isMessageUnlocked(customUnlock, checkDate)).toBe(true);
  });
});
