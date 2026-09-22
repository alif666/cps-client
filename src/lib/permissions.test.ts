import { can, canAny } from './permissions';
import type { User } from './types';
import { describe, expect, it } from 'vitest';

const user: User = { id: 'user-1', fullName: 'Admin', email: 'admin@example.com', roles: [], permissions: ['organization.manage', 'access.manage'] };

describe('permission helpers', () => {
  it('checks a single permission', () => {
    expect(can(user, 'organization.manage')).toBe(true);
    expect(can(user, 'doa.manage')).toBe(false);
    expect(can(null, 'organization.manage')).toBe(false);
  });

  it('checks whether a user can access any permission in a group', () => {
    expect(canAny(user, ['doa.manage', 'access.manage'])).toBe(true);
    expect(canAny(user, ['doa.manage', 'inventory.manage'])).toBe(false);
  });
});
