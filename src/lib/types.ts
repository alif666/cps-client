export type User = { id: string; employeeCode?: string; fullName: string; email: string; isActive?: boolean; roles: Role[]; permissions: string[] };
export type Role = { id: string; code: string; name: string; description?: string; isActive: boolean; createdAt?: string; updatedAt?: string };
export type Organization = { id: string; code: string; name: string; isActive: boolean; createdAt: string; updatedAt: string };
export type AccessEntity = { id: string; code: string; name: string; isActive: boolean; createdAt?: string; updatedAt?: string };
export type DoaRule = { id: string; transactionType: string; companyId?: string; businessUnitId?: string; procurementCategory?: string; minValue?: string; maxValue?: string; approverRoleId: string; sequenceNo: number; isParallel: boolean; effectiveFrom: string; effectiveTo?: string; isActive: boolean };
export type ApiEnvelope<T> = { data: T };
