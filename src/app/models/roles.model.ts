export interface Role {
    id: number,
    roleName: string,
    allowedPermissions: string[],
    features: string[]
}
