export interface Role {
    id: string,
    roleName: string,
    allowedPermissions: string[],
    features: string[]
}
