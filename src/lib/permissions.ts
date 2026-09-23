import type {User} from './types';

export const can = (user: User | null | undefined, permission: string) => Boolean(user?.permissions.includes(permission));
export const canAny = (user: User | null | undefined, permissions: string[]) => permissions.some((permission) => can(user, permission));
