import { useKeycloak } from "@react-keycloak/web";

export const useHasRole = (role) => {
    const { keycloak } = useKeycloak();

    if (!keycloak?.authenticated || !keycloak?.tokenParsed) {
        return false;
    }

    const roleUpper = role.toUpperCase();
    const userRoles = [];

    if (keycloak.tokenParsed.realm_access?.roles) {
        userRoles.push(...keycloak.tokenParsed.realm_access.roles.map(r => r.toUpperCase()));
    }

    if (keycloak.tokenParsed.resource_access) {
        Object.values(keycloak.tokenParsed.resource_access).forEach(clientAccess => {
            if (clientAccess?.roles) {
                userRoles.push(...clientAccess.roles.map(r => r.toUpperCase()));
            }
        });
    }


    return userRoles.includes(roleUpper);
};