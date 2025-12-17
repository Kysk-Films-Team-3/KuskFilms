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

    if (keycloak.authenticated && roleUpper === 'ADMIN') {
        console.log('=== ROLE CHECK DEBUG ===');
        console.log('Realm roles:', keycloak.tokenParsed.realm_access?.roles || []);
        console.log('Resource access:', keycloak.tokenParsed.resource_access || {});
        
        if (keycloak.tokenParsed.resource_access) {
            Object.entries(keycloak.tokenParsed.resource_access).forEach(([clientId, clientAccess]) => {
                console.log(`Client "${clientId}" roles:`, clientAccess?.roles || []);
            });
        }
        
        console.log('All collected roles:', userRoles);
        console.log('Looking for role:', roleUpper);
        console.log('Has role:', userRoles.includes(roleUpper));
        console.log('========================');
    }

    return userRoles.includes(roleUpper);
};