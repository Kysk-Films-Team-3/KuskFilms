import { useKeycloak } from "@react-keycloak/web";

export const useHasRole = (role) => {
    const { keycloak } = useKeycloak();

    if (!keycloak?.authenticated || !keycloak?.tokenParsed?.realm_access?.roles) {
        return false;
    }

    const userRoles = keycloak.tokenParsed.realm_access.roles.map(r => r.toUpperCase());

    return userRoles.includes(role.toUpperCase());
};