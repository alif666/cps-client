import { apiFetch } from './client';
import type { AccessEntity, DoaRule, Organization, Role, User } from '../types';

export const listOrganizations = () => apiFetch<Organization[]>('/organizations');
export const createOrganization = (body: { code: string; name: string }) => apiFetch<Organization>('/organizations', { method: 'POST', body: JSON.stringify(body) });
export const updateOrganization = (id: string, body: { code?: string; name?: string }) => apiFetch<Organization>(`/organizations/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const setOrganizationStatus = (id: string, isActive: boolean) => apiFetch<Organization>(`/organizations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
export const listRoles = () => apiFetch<Role[]>('/access/roles');
export const createRole = (body: { code: string; name: string; description?: string }) => apiFetch<Role>('/access/roles', { method: 'POST', body: JSON.stringify(body) });
export const listUsers = () => apiFetch<User[]>('/access/users');
export const createUser = (body: { employeeCode: string; fullName: string; email: string; password: string }) => apiFetch<User>('/access/users', { method: 'POST', body: JSON.stringify(body) });
export const createAssignment = (body: { userId: string; companyId: string; businessUnitId?: string; roleId: string }) => apiFetch('/access/user-assignments', { method: 'POST', body: JSON.stringify(body) });
export const listBusinessUnits = (companyId: string) => apiFetch<AccessEntity[]>(`/access/business-units?companyId=${encodeURIComponent(companyId)}`);
export const listDoaRules = () => apiFetch<DoaRule[]>('/doa-rules');
export const createDoaRule = (body: Record<string, unknown>) => apiFetch<DoaRule>('/doa-rules', { method: 'POST', body: JSON.stringify(body) });
