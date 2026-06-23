type Environment = NodeJS.ProcessEnv;

export type KeycloakConfig = {
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  keycloakClientSecret?: string;
  jwtIssuer: string;
  jwtAudience: string;
  jwksUri: string;
};

const withoutTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export function resolveKeycloakConfig(environment: Environment = process.env): KeycloakConfig {
  const configuredUrl = environment.KEYCLOAK_URL?.trim();
  if (!configuredUrl) {
    throw new Error("KEYCLOAK_URL nije definisan.");
  }

  const keycloakUrl = withoutTrailingSlash(configuredUrl);
  const keycloakRealm = environment.KEYCLOAK_REALM?.trim() || "Grupa12SI";
  const keycloakClientId = environment.KEYCLOAK_CLIENT_ID?.trim() || "public";
  const realmUrl = `${keycloakUrl}/realms/${keycloakRealm}`;

  return {
    keycloakUrl,
    keycloakRealm,
    keycloakClientId,
    keycloakClientSecret: environment.KEYCLOAK_CLIENT_SECRET?.trim() || undefined,
    jwtIssuer: withoutTrailingSlash(environment.JWT_ISSUER?.trim() || realmUrl),
    jwtAudience: environment.JWT_AUDIENCE?.trim() || "account",
    jwksUri:
      environment.JWKS_URI?.trim() ||
      `${realmUrl}/protocol/openid-connect/certs`,
  };
}
