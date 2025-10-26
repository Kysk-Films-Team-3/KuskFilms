import Keycloak from "keycloak-js";
import { AUTH_URL } from "./config";

export const keycloak = new Keycloak({
    url: AUTH_URL,
    realm: 'kyskfilms',
    clientId: 'kyskfilms-frontend',
});

